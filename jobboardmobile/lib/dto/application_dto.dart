import 'company_dto.dart';
import 'job_dto.dart';

class ApplicationDTO {
  final int id;
  final String employeeName;
  final int userId;
  final JobDTO jobDTO;
  final CompanyDTO companyDTO;
  final bool approved; // Added field

  ApplicationDTO({
    required this.id,
    required this.employeeName,
    required this.userId,
    required this.jobDTO,
    required this.companyDTO,
    required this.approved, // Updated constructor
  });

  factory ApplicationDTO.fromJson(Map<String, dynamic> json) {
    return ApplicationDTO(
      id: json['id'] ?? 0,
      employeeName: json['employeeName'] ?? '',
      userId: json['userId'] ?? 0,
      jobDTO: JobDTO.fromJson(json['jobDTO'] ?? {}),
      companyDTO: CompanyDTO.fromJson(json['companyDTO'] ?? {}),
      approved: json['approved'] ?? false, // Updated fromJson
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeName': employeeName,
      'userId': userId,
      'jobDTO': jobDTO.toJson(),
      'companyDTO': companyDTO.toJson(),
      'approved': approved, // Updated toJson
    };
  }
}
