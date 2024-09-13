class Company {
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
  // final List<Review> reviews;
  final bool membershipRequired;

  Company({
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
    // required this.reviews,
    required this.membershipRequired,
  });

  factory Company.fromJson(Map<String, dynamic> json) {
    return Company(
      companyId: json['companyId'] ?? 0,
      companyName: json['companyName'] ?? '',
      logo: json['logo'] ?? '',
      websiteLink: json['websiteLink'] ?? '',
      description: json['description'] ?? '',
      location: json['location'] ?? '',
      keySkills: json['keySkills'] ?? '',
      type: json['type'] ?? '',
      companySize: json['companySize'] ?? '',
      country: json['country'] ?? '',
      countryCode: json['countryCode'] ?? '',
      workingDays: json['workingDays'] ?? '',
      // reviews: (json['reviews'] as List?)
      //     ?.map((review) => Review.fromJson(review))
      //     .toList() ?? [],
      membershipRequired: json['membershipRequired'] ?? false,
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
      // 'reviews': reviews.map((review) => review.toJson()).toList(),
      'membershipRequired': membershipRequired,
    };
  }
}
