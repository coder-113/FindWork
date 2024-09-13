import 'dart:ffi';

import 'job_model.dart';
import 'company_model.dart';

class Application {
  final int id;
  final String employeeName;
  final int userId;
  final Job job; // Assuming Job is another model you have
  final Bool approved; // Assuming Job is another model you have
  final Company company; // Assuming Company is another model you have
  final List<int>? cvFile; // Assuming the cvFile is a list of bytes, you may need to adjust this
  final String coverLetter;

  Application({
    required this.id,
    required this.employeeName,
    required this.userId,
    required this.job,
    required this.approved,
    required this.company,
    this.cvFile,
    required this.coverLetter,
  });

  factory Application.fromJson(Map<String, dynamic> json) {
    return Application(
      id: json['id'],
      employeeName: json['employeeName'],
      userId: json['userId'],
      job: Job.fromJson(json['job']), // Ensure Job.fromJson is correctly defined
      company: Company.fromJson(json['company']), // Ensure Company.fromJson is correctly defined
      cvFile: json['cvFile'] != null ? List<int>.from(json['cvFile']) : null, // Adjust if cvFile is not a list of bytes
      coverLetter: json['coverLetter'],
       approved: json['approved'] ?? false, // Updated fromJson
    );
  }
}
