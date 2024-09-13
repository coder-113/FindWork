class ReviewLike {
  int id;
  int reviewId;
  int userId;

  ReviewLike({
    required this.id,
    required this.reviewId,
    required this.userId,
  });

  factory ReviewLike.fromJson(Map<String, dynamic> json) {
    return ReviewLike(
      id: json['id'],
      reviewId: json['reviewId'],
      userId: json['userId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'reviewId': reviewId,
      'userId': userId,
    };
  }
}
