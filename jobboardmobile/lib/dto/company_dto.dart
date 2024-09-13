class CompanyDTO {
  final int companyId;
  final String companyName;
  final String logo;
  final String websiteLink;
  final String description;
  final String location;
  final String keySkills;
  final String type;
  final String companySize;
  final String country;
  final String countryCode;
  final String workingDays;
  final bool membershipRequired;

  CompanyDTO({
    required this.companyId,
    required this.companyName,
    required this.logo,
    required this.websiteLink,
    required this.description,
    required this.location,
    required this.keySkills,
    required this.type,
    required this.companySize,
    required this.country,
    required this.countryCode,
    required this.workingDays,
    required this.membershipRequired,
  });

  factory CompanyDTO.fromJson(Map<String, dynamic> json) {
    return CompanyDTO(
      companyId: json['companyId'],
      companyName: json['companyName'],
      logo: json['logo'],
      websiteLink: json['websiteLink'],
      description: json['description'],
      location: json['location'],
      keySkills: json['keySkills'],
      type: json['type'],
      companySize: json['companySize'],
      country: json['country'],
      countryCode: json['countryCode'],
      workingDays: json['workingDays'],
      membershipRequired: json['membershipRequired'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'companyId': companyId,
      'companyName': companyName,
      'logo': logo,
      'websiteLink': websiteLink,
      'description': description,
      'location': location,
      'keySkills': keySkills,
      'type': type,
      'companySize': companySize,
      'country': country,
      'countryCode': countryCode,
      'workingDays': workingDays,
      'membershipRequired': membershipRequired,
    };
  }
}
