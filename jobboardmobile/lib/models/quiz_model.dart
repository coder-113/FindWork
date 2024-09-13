class Quiz {
  final int id;
  final String title;
  final String description;
  final String imageUrl;
  final int numberOfUsers;

  Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.numberOfUsers,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) {
    return Quiz(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['imageUrl'],
      numberOfUsers: json['numberOfUsers'],
    );
  }
}
