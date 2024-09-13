import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';

import '../models/category_quiz_model.dart';

class CategoryQuizService {
  final String baseUrl = '${Endpoint.baseUrl}/categoriesquiz';

  Future<List<CategoryQuiz>> getAllCategories() async {
    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body) as List;
      return jsonResponse
          .map((category) => CategoryQuiz.fromJson(category))
          .toList();
    } else {
      throw Exception('Failed to load categories');
    }
  }
}
