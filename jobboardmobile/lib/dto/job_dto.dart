class JobDTO {
  final int id;
  final String title;
  final String offeredSalary;
  final String description;
  final String responsibilities;
  final String requiredSkills;
  final String workSchedule;
  final String keySkills;
  final String position;
  final String experience;
  final String qualification;
  final String jobType;
  final String contractType;
  final String benefit;
  final DateTime createdAt;
  final int slot;
  final int profileApproved;
  final bool isSuperHot;
  final List<int> categoryId;
  final int companyId;
  final String expire;

  JobDTO({
    required this.id,
    required this.title,
    required this.offeredSalary,
    required this.description,
    required this.responsibilities,
    required this.requiredSkills,
    required this.workSchedule,
    required this.keySkills,
    required this.position,
    required this.experience,
    required this.qualification,
    required this.jobType,
    required this.contractType,
    required this.benefit,
    required this.createdAt,
    required this.slot,
    required this.profileApproved,
    required this.isSuperHot,
    required this.categoryId,
    required this.companyId,
    required this.expire,
  });

  factory JobDTO.fromJson(Map<String, dynamic> json) {
    return JobDTO(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      offeredSalary: json['offeredSalary'] ?? '',
      description: json['description'] ?? '',
      responsibilities: json['responsibilities'] ?? '',
      requiredSkills: json['requiredSkills'] ?? '',
      workSchedule: json['workSchedule'] ?? '',
      keySkills: json['keySkills'] ?? '',
      position: json['position'] ?? '',
      experience: json['experience'] ?? '',
      qualification: json['qualification'] ?? '',
      jobType: json['jobType'] ?? '',
      contractType: json['contractType'] ?? '',
      benefit: json['benefit'] ?? '',
      createdAt: DateTime.parse(json['createdAt'] ?? ''),
      slot: json['slot'] ?? 0,
      profileApproved: json['profileApproved'] ?? 0,
      isSuperHot: json['isSuperHot'] ?? false,
      categoryId: List<int>.from(json['categoryId'] ?? []),
      companyId: json['companyId'] ?? 0,
      expire: json['expire'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'offeredSalary': offeredSalary,
      'description': description,
      'responsibilities': responsibilities,
      'requiredSkills': requiredSkills,
      'workSchedule': workSchedule,
      'keySkills': keySkills,
      'position': position,
      'experience': experience,
      'qualification': qualification,
      'jobType': jobType,
      'contractType': contractType,
      'benefit': benefit,
      'createdAt': createdAt.toIso8601String(),
      'slot': slot,
      'profileApproved': profileApproved,
      'isSuperHot': isSuperHot,
      'categoryId': categoryId,
      'companyId': companyId,
      'expire': expire,
    };
  }
}
