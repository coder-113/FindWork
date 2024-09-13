class FavoriteJob {
  final int id;
  final int jobId;
  final int companyId;
  final String companyLogo;
  final String jobTitle;
  final String position;
  final String location;
  final String companyName;
  // final List<Skill> skills;
  final List<int> categoryId;
  final String username;
  final String createdAt;
  final String offeredSalary;
  final String jobDescription;
  final String responsibilities;
  final String requiredSkills;
  final String workSchedule;
  final String experience;
  final String qualification;
  final String jobType;
  final String contractType;
  final String benefit;
  final int slot;
  final String expire;
  final String websiteLink;
  final String companyDescription;
  final String keySkills;
  final String type;
  final String companySize;
  final String country;
  final String countryCode;
  final String workingDays;

  FavoriteJob({
    required this.id,
    required this.jobId,
    required this.companyId,
    required this.companyLogo,
    required this.jobTitle,
    required this.position,
    required this.location,
    required this.companyName,
    // required this.skills,
    required this.categoryId,
    required this.username,
    required this.createdAt,
    required this.offeredSalary,
    required this.jobDescription,
    required this.responsibilities,
    required this.requiredSkills,
    required this.workSchedule,
    required this.experience,
    required this.qualification,
    required this.jobType,
    required this.contractType,
    required this.benefit,
    required this.slot,
    required this.expire,
    required this.websiteLink,
    required this.companyDescription,
    required this.keySkills,
    required this.type,
    required this.companySize,
    required this.country,
    required this.countryCode,
    required this.workingDays,
  });

  // Factory method to create an instance from JSON
  factory FavoriteJob.fromJson(Map<String, dynamic> json) {
    return FavoriteJob(
      id: json['favoriteId'] as int,
      jobId: json['jobId'] as int,
      companyId: json['companyId'] as int,
      companyLogo: json['companyLogo'] as String,
      jobTitle: json['jobTitle'] as String,
      position: json['position'] as String,
      location: json['location'] as String,
      companyName: json['companyName'] as String,
      categoryId: List<int>.from(json['categoryId']),
      // categoryId: json['categoryId'],
      username: json['username'] as String,
      createdAt: json['createdAt'] as String,
      offeredSalary: json['offeredSalary'] as String,
      jobDescription: json['jobDescription'] as String,
      responsibilities: json['responsibilities'] as String,
      requiredSkills: json['requiredSkills'] as String,
      workSchedule: json['workSchedule'] as String,
      experience: json['experience'] as String,
      qualification: json['qualification'] as String,
      jobType: json['jobType'] ?? "",
      contractType: json['contractType'] ?? "",
      benefit: json['benefit'] as String,
      slot: json['slot'] as int,
      expire: json['expire'] as String,
      websiteLink: json['websiteLink'] as String,
      companyDescription: json['companyDescription'] as String,
      keySkills: json['keySkills'] as String,
      type: json['type'] as String,
      companySize: json['companySize'] as String,
      country: json['country'] as String,
      countryCode: json['countryCode'] as String,
      workingDays: json['workingDays'] as String,
    );
  }

  // Method to convert an instance to JSON
  Map<String, dynamic> toJson() {
    return {
      'favoriteId': id,
      'jobId': jobId,
      'companyId': companyId,
      'companyLogo': companyLogo,
      'jobTitle': jobTitle,
      'position': position,
      'location': location,
      'companyName': companyName,
      // 'skills': skills.map((skill) => skill.toJson()).toList(),
      'categoryId': categoryId,
      'username': username,
      'createdAt': createdAt,
      'offeredSalary': offeredSalary,
      'jobDescription': jobDescription,
      'responsibilities': responsibilities,
      'requiredSkills': requiredSkills,
      'workSchedule': workSchedule,
      'experience': experience,
      'qualification': qualification,
      'jobType': jobType,
      'contractType': contractType,
      'benefit': benefit,
      'slot': slot,
      'expire': expire,
      'websiteLink': websiteLink,
      'companyDescription': companyDescription,
      'keySkills': keySkills,
      'type': type,
      'companySize': companySize,
      'country': country,
      'countryCode': countryCode,
      'workingDays': workingDays,
    };
  }
}
