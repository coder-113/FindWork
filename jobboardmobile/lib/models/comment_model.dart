import 'package:jobboardmobile/dto/blog_dto.dart';
import 'package:jobboardmobile/models/content_model.dart';
import 'package:jobboardmobile/models/user_model.dart';

class Comment {
  String id;
  BlogDTO blog;
  List<Comment> children;
  String content;
  User user;
  DateTime createdAt;
  DateTime updatedAt;

  Comment({
    required this.id,
    required this.blog,
    required this.children,
    required this.content,
    required this.user,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    var childrenList =
        json['children'] as List<dynamic>?; // Handle potential null
    List<Comment> children = childrenList != null
        ? childrenList.map((e) => Comment.fromJson(e)).toList()
        : [];

    return Comment(
      id: json['id']?.toString() ??
          '', // Ensure id is treated as a String and provide a default value
      blog: BlogDTO.fromJson(json['blog']),
      children: children,
      content: json['content'] ?? '', // Provide a default value for content
      user: User.fromJson(json['user']),
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'blog': blog.toJson(),
      'content': content,
      'user': user.toJson(),
    };
  }
}
