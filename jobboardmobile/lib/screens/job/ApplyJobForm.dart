import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../../models/job_model.dart';
import '../../models/company_model.dart';
import '../../service/jobApplication_service.dart';

class ApplyJobForm extends StatefulWidget {
  final Job job;
  final Company company;
  final int userId;
  final VoidCallback onApplicationSubmitted;

  ApplyJobForm({
    required this.job,
    required this.company,
    required this.userId,
    required this.onApplicationSubmitted,
  });

  @override
  _ApplyJobFormState createState() => _ApplyJobFormState();
}

class _ApplyJobFormState extends State<ApplyJobForm> {
  final _formKey = GlobalKey<FormState>();
  String _employeeName = '';
  String _coverLetter = '';
  PlatformFile? _cvFile;

  Future<void> _pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      setState(() {
        _cvFile = result.files.first;
      });
    }
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate() && _cvFile != null) {
      _formKey.currentState!.save();

      try {
        await JobApplicationService().applyJob(
          widget.job.id,
          widget.company.companyId,
          widget.userId,
          _employeeName,
          _cvFile!,
          _coverLetter,
        );

        // Show success dialog
        Navigator.of(context).pop(); // Close the form
        _showSuccessDialog();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit application. Please try again.')),
        );
      }
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return AlertDialog(
          title: Icon(Icons.check_circle, color: Colors.green, size: 60),
          content: Text('Application submitted successfully!'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                widget.onApplicationSubmitted();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Apply for ${widget.job.title}'),
        backgroundColor: Color(0xFF89BA16),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              Text(
                'Apply for Job',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Employee Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) => value!.isEmpty ? 'Please enter your name' : null,
                onSaved: (value) => _employeeName = value!,
              ),
              SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _pickFile,
                icon: Icon(Icons.file_upload),
                label: Text(_cvFile == null ? 'Pick CV File (PDF)' : 'CV File Selected'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF89BA16), // Use backgroundColor instead of primary
                ),
              ),
              if (_cvFile != null) Text(_cvFile!.name, style: TextStyle(fontSize: 16)),
              SizedBox(height: 16),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Cover Letter',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.edit),
                ),
                maxLines: 5,
                validator: (value) => value!.isEmpty ? 'Please enter a cover letter' : null,
                onSaved: (value) => _coverLetter = value!,
              ),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text('Submit Application'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF89BA16), // Use backgroundColor instead of primary
                  padding: EdgeInsets.symmetric(vertical: 16),
                  textStyle: TextStyle(fontSize: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
