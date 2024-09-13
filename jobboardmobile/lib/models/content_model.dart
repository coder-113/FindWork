import 'package:jobboardmobile/models/category_model.dart';
import 'package:jobboardmobile/models/hashtags_model.dart';
import 'package:jobboardmobile/models/user_model.dart';

class ContentModel {
  int id;
  String title;
  String content;
  List<Category> categories;
  User user;
  String slug;
  String citation;
  String imageUrl;
  String thumbnailUrl;
  DateTime createdAt;
  DateTime updatedAt;
  List<HashTag> hashtags;

  ContentModel(
      {required this.id,
      required this.title,
      required this.content,
      required this.categories,
      required this.user,
      required this.slug,
      required this.citation,
      required this.imageUrl,
      required this.thumbnailUrl,
      required this.createdAt,
      required this.updatedAt,
      required this.hashtags});

  // Factory method to create a Content from JSON
  factory ContentModel.fromJson(Map<String, dynamic> json) {
    return ContentModel(
        id: json['id'],
        title: json['title'],
        content: json['content'],
        categories: List<Category>.from(
            json['categories'].map((item) => Category.fromJson(item))),
        user: User.fromJson(json['user']),
        slug: json['slug'],
        citation: json['citation'],
        imageUrl: json['imageUrl'],
        thumbnailUrl: json['thumbnailUrl'],
        createdAt: DateTime.parse(json['createdAt']),
        updatedAt: DateTime.parse(json['updatedAt']),
        hashtags: List<HashTag>.from(
            json['hashtags'].map((item) => HashTag.fromJson(item))));
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
    };
  }
}
