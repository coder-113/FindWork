class Review {
  final int id;
  final String title;
  final String description;
  final double rating;
  final String company;
  final String user;
  final String username;
  final String imageUrl;
  int likeCount;
  bool likedByCurrentUser;

  Review({
    required this.id,
    required this.title,
    required this.description,
    required this.rating,
    required this.company,
    required this.user,
    required this.username,
    required this.imageUrl,
    this.likeCount = 0,
    this.likedByCurrentUser = false,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      rating: (json['rating'] ?? 0).toDouble(),
      company: json['company'] ?? '',
      user: json['user'] ?? '',
      username: json['username'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      likeCount: json['likeCount'] ?? 0,
      likedByCurrentUser: json['likedByCurrentUser'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'rating': rating,
      'company': company,
      'user': user,
      'username': username,
      'imageUrl': imageUrl,
      'likeCount': likeCount,
      'likedByCurrentUser': likedByCurrentUser,
    };
  }

  Review copyWith({bool? likedByCurrentUser}) {
    return Review(
      id: this.id,
      title: this.title,
      description: this.description,
      rating: this.rating,
      company: this.company,
      user: this.user,
      username: this.username,
      imageUrl: this.imageUrl,
      likeCount: this.likeCount,
      likedByCurrentUser: likedByCurrentUser ?? this.likedByCurrentUser,
    );
  }
}
