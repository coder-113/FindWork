class User {
  int id;
  String username;
  String email;
  String firstName;
  String lastName;
  String bio;
  String? imageUrl;
  String gender;

  User(
      {required this.id,
      required this.username,
      required this.email,
      required this.firstName,
      required this.lastName,
      required this.bio,
      this.imageUrl,
      required this.gender});

  // Factory method to create a User from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
        id: json['id'],
        username: json['username'] ?? "",
        email: json['email'] ?? "",
        firstName: json['firstName'] ?? "",
        lastName: json['lastName'] ?? "",
        bio: json['bio'] ?? "",
        imageUrl: json['imageUrl'] ?? "",
        gender: json['gender'] ?? "");
  }
  factory User.empty() {
    return User(
        id: 0,
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        bio: '',
        imageUrl: '',
        gender: '');
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'imageUrl': imageUrl
    };
  }

  @override
  String toString() {
    return 'User{id: $id, username: $username, firstName: $firstName, lastName: $lastName}';
  }
}
