class HashTag {
  int id;
  String name;

  HashTag({required this.id, required this.name});
  // Factory method to create a Category from JSON
  factory HashTag.fromJson(Map<String, dynamic> json) {
    return HashTag(
      id: json['id'],
      name: json['name'],
    );
  }
}
