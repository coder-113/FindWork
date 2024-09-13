class BlogDTO {
  final int id;

  BlogDTO({required this.id});

  factory BlogDTO.fromJson(Map<String, dynamic> json) {
    return BlogDTO(id: json['id']);
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
    };
  }
}
