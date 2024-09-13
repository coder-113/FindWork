import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/blog_model.dart';
import 'package:jobboardmobile/models/category_model.dart';
import 'package:jobboardmobile/models/content_model.dart';

class BlogService {
  final String baseUrl = '${Endpoint.baseUrl}/blogs';
  final String categoryUrl = '${Endpoint.baseUrl}/blog-category';

  Future<BlogModel> searchBlogs(String query, String type,
      {int page = 0,
      int size = 10,
      int visibility = 2,
      String order = "asc"}) async {
    final encodedCategory = Uri.encodeComponent(type);

    final response = await http.get(Uri.parse(
        '$baseUrl/search?query=$query&type=$encodedCategory&page=$page&size=$size&visibility=$visibility&order=$order'));

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      return BlogModel.fromJson(jsonResponse);
    } else {
      throw Exception('Failed to load blogs');
    }
  }

  Future<ContentModel?> getBlogBySlug(String slug) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/$slug'));
      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return ContentModel.fromJson(jsonResponse);
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  Future<List<Category>> getBlogCategories() async {
    try {
      final response = await http.get(Uri.parse(categoryUrl));
      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body) as List;
        return jsonResponse.map((data) => Category.fromJson(data)).toList();
      }
    } catch (e) {
      throw Exception('Failed to load blog categories');
    }
    return [];
  }
}
