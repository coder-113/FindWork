import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/comment_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';

class CommentService {
  final String baseUrl = '${Endpoint.baseUrl}/comments';

  Future<List<Comment>> getCommentsByBlogSlug(String slug) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/blog/$slug'));
      if (response.statusCode == 200) {
        List<dynamic> jsonList = jsonDecode(response.body);
        List<Comment> comments =
            jsonList.map((json) => Comment.fromJson(json)).toList();

        return comments;
      } else {
        throw Exception('Failed to load comments');
      }
    } catch (e) {
      throw Exception('Failed to load comments: $e');
    }
  }

  Future<Comment> createComment(var comment) async {
    try {
      final AuthService authService = AuthService();

      String? accessToken = await authService.getAccessToken();

      print('Token: $accessToken');

      final response = await http.post(
        Uri.parse(baseUrl),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
        body: jsonEncode(comment),
      );

      if (response.statusCode == 200) {
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');
        return Comment.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to create comment');
      }
    } catch (e) {
      throw Exception('Failed to create comment: $e');
    }
  }

  Future<void> deleteComment(String id) async {
    try {
      final AuthService authService = AuthService();

      String? accessToken = await authService.getAccessToken();
      final response = await http.delete(
        Uri.parse('$baseUrl/$id'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to delete comment');
      }
    } catch (e) {
      throw Exception('Failed to delete comment: $e');
    }
  }

  Future<Comment> updateComment(String id, var comment) async {
    try {
      final AuthService authService = AuthService();

      String? accessToken = await authService.getAccessToken();
      final response = await http.put(
        Uri.parse('$baseUrl/$id'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
        body: jsonEncode(comment),
      );

      if (response.statusCode == 200) {
        return Comment.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to update comment');
      }
    } catch (e) {
      throw Exception('Failed to update comment: $e');
    }
  }
}
