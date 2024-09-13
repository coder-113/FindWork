import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:http/http.dart' as http;

import '../../dto/Inforuser_dto.dart';
import '../../service/infor_service.dart';

class MyProfileScreen extends StatefulWidget {
  const MyProfileScreen({Key? key}) : super(key: key);

  @override
  _MyProfileScreenState createState() => _MyProfileScreenState();
}

class _MyProfileScreenState extends State<MyProfileScreen> {
  final UserService _userService = UserService();
  final _formKey = GlobalKey<FormState>();
  late InforUserDTO _user;
  File? _image;
  bool _isLoading = true;

  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _bioController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _facebookController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _dateOfBirthController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      String? username = await _userService.getUsername();
      if (username != null) {
        var userData = await _userService.getUserByUsername(username);
        setState(() {
          _user = InforUserDTO.fromJson(userData);
          _isLoading = false;
          _populateFields();
        });
      }
    } catch (e) {
      print('Error loading user data: $e');
    }
  }

  void _populateFields() {
    _firstNameController.text = _user.firstName ?? '';
    _lastNameController.text = _user.lastName ?? '';
    _bioController.text = _user.bio ?? '';
    _phoneController.text = _user.numberphone ?? '';
    _facebookController.text = _user.facebook ?? '';
    _addressController.text = _user.currentAddress ?? '';
    _dateOfBirthController.text = _user.dateOfBirth != null
        ? DateFormat('yyyy-MM-dd').format(_user.dateOfBirth!)
        : '';
  }

  Future<void> _pickImage() async {
    final ImagePicker _picker = ImagePicker();
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      setState(() {
        _image = File(image.path);
      });
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _user.dateOfBirth ?? DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        _dateOfBirthController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _updateProfile() async {
    if (_formKey.currentState!.validate()) {
      try {
        Map<String, dynamic> userInfo = {
          'firstName': _firstNameController.text,
          'lastName': _lastNameController.text,
          'bio': _bioController.text,
          'numberphone': _phoneController.text,
          'facebook': _facebookController.text,
          'currentAddress': _addressController.text,
          'dateOfBirth': _dateOfBirthController.text,
        };

        var imageFile = _image != null
            ? await http.MultipartFile.fromPath('imageFile', _image!.path)
            : null;

        var response = await _userService.updateUser(
            context, _user.id!, userInfo, imageFile);

        if (response.statusCode == 200) {
          // Update local storage
          await _userService.saveFirstName(_firstNameController.text);
          await _userService.saveLastName(_lastNameController.text);
          if (_image != null) {
            // Assuming the new image URL is returned in the response body
            var responseBody = json.decode(response.body);
            if (responseBody['imageUrl'] != null) {
              await _userService.saveImageUrl(responseBody['imageUrl']);
            }
          }

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Profile updated successfully')),
          );
          Navigator.pop(
              context, true); // Return true indicating a successful update
        } else {
          throw Exception('Failed to update profile');
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error updating profile: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        backgroundColor: Colors.blue,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: GestureDetector(
                        onTap: _pickImage,
                        child: Stack(
                          children: [
                            CircleAvatar(
                              radius: 60,
                              backgroundImage: _image != null
                                  ? FileImage(_image!)
                                  : _user.imageUrl != null
                                      ? NetworkImage(_user.imageUrl!
                                          .replaceFirst('http://localhost:8080',
                                              Endpoint.imageUrl))
                                      : null,
                              child: _image == null && _user.imageUrl == null
                                  ? const Icon(Icons.person, size: 60)
                                  : null,
                            ),
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: Container(
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: Colors.blue,
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.camera_alt,
                                    color: Colors.white, size: 20),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    _buildReadOnlyField('Username', _user.username ?? ''),
                    _buildReadOnlyField('Email', _user.email ?? ''),
                    _buildTextField('First Name', _firstNameController),
                    _buildTextField('Last Name', _lastNameController),
                    _buildTextField('Bio', _bioController, maxLines: 3),
                    _buildTextField('Phone', _phoneController),
                    _buildTextField('Facebook', _facebookController),
                    _buildTextField('Current Address', _addressController),
                    _buildDateField(
                        'Date of Birth', _dateOfBirthController, _selectDate),
                    const SizedBox(height: 20),
                    Center(
                      child: ElevatedButton(
                        onPressed: _updateProfile,
                        child: const Text('Update Profile'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          padding: EdgeInsets.symmetric(
                            horizontal: 50,
                            vertical: 15,
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildReadOnlyField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontWeight: FontWeight.bold)),
          Text(value),
          Divider(),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller,
      {int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
        ),
        maxLines: maxLines,
        validator: (value) => value!.isEmpty ? 'Please enter $label' : null,
      ),
    );
  }

  Widget _buildDateField(String label, TextEditingController controller,
      Function(BuildContext) onTap) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
          suffixIcon: Icon(Icons.calendar_today),
        ),
        readOnly: true,
        onTap: () => onTap(context),
      ),
    );
  }
}
