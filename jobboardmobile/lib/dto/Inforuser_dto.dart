import 'package:intl/intl.dart';

enum Gender { MALE, FEMALE, OTHER }

class InforUserDTO {
  int? id;
  String? email;
  String? username;
  String? firstName;
  String? lastName;
  Gender? gender;
  String? imageUrl;
  String? bio;
  String? numberphone;
  String? facebook;
  DateTime? dateOfBirth;
  String? currentAddress;

  InforUserDTO({
    this.id,
    this.email,
    this.username,
    this.firstName,
    this.lastName,
    this.gender,
    this.imageUrl,
    this.bio,
    this.numberphone,
    this.facebook,
    this.dateOfBirth,
    this.currentAddress,
  });

  factory InforUserDTO.fromJson(Map<String, dynamic> json) {
    return InforUserDTO(
      id: json['id'] as int?,
      email: json['email'] as String?,
      username: json['username'] as String?,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      gender: json['gender'] != null
          ? Gender.values
              .firstWhere((e) => e.toString().split('.').last == json['gender'])
          : null,
      imageUrl: json['imageUrl'] as String?,
      bio: json['bio'] as String?,
      numberphone: json['numberphone'] as String?,
      facebook: json['facebook'] as String?,
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.parse(json['dateOfBirth'])
          : null,
      currentAddress: json['currentAddress'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    final DateFormat formatter = DateFormat('yyyy-MM-dd');
    return {
      'id': id,
      'email': email,
      'username': username,
      'firstName': firstName,
      'lastName': lastName,
      'gender': gender?.toString().split('.').last,
      'imageUrl': imageUrl,
      'bio': bio,
      'numberphone': numberphone,
      'facebook': facebook,
      'dateOfBirth':
          dateOfBirth != null ? formatter.format(dateOfBirth!) : null,
      'currentAddress': currentAddress,
    };
  }
}
