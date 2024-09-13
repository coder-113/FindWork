import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import '../constant/endpoint.dart';
import '../models/quiz_model.dart';
import 'auth_service.dart';

class QuizService {
  // static const String baseUrl = 'http://192.168.110.19:8080/api';
  static const String baseUrl = '${Endpoint.baseUrl}';

  final AuthService _authService = AuthService();

  Future<Map<String, dynamic>> getAttemptsInfo(int quizId, int userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/quizzes/$quizId/attempts?userId=$userId'),
    );
    if (response.statusCode == 200) {
      Map<String, dynamic> data = json.decode(response.body);
      print('getAttemptsInfo response: $data');
      return data;
    } else {
      print('Failed to load attempts info: ${response.statusCode}');
      throw Exception('Failed to load attempts info');
    }
  }

  static Future<dynamic> getQuizDetails(String quizId) async {
    final response = await http.get(Uri.parse('$baseUrl/quizzes/$quizId'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load quiz details');
    }
  }

  static Future<List<dynamic>> getQuizQuestions(String quizId,
      {int count = 10}) async {
    final url = '$baseUrl/quizzes/$quizId/questions?count=$count';
    print('Requesting URL: $url');
    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load quiz questions');
    }
  }

  static Future<dynamic> submitQuiz(dynamic submission) async {
    final response = await http.post(
      Uri.parse('$baseUrl/quizzes/submit'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(submission),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to submit quiz');
    }
  }

  Future<List<Quiz>> fetchQuizzes() async {
    try {
      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http.get(
        Uri.parse('$baseUrl/quizzes'),
        headers: {'Authorization': 'Bearer $accessToken'},
      );
      if (response.statusCode == 200) {
        List<dynamic> jsonData = jsonDecode(response.body);
        List<Quiz> quizzes =
            jsonData.map((json) => Quiz.fromJson(json)).toList();
        return quizzes;
      } else {
        throw Exception('Failed to fetch quizzes');
      }
    } catch (e) {
      throw Exception('Failed to fetch quizzes: $e');
    }
  }

  Future<List<dynamic>> fetchQuizQuestions(String quizId,
      {int count = 10}) async {
    try {
      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http.get(
        Uri.parse('$baseUrl/quizzes/$quizId/questions?count=$count'),
        headers: {'Authorization': 'Bearer $accessToken'},
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to fetch quiz questions');
      }
    } catch (e) {
      throw Exception('Failed to fetch quiz questions: $e');
    }
  }

  Future<void> submitQuizCompletion(String quizId, String userId) async {
    try {
      String? accessToken = await _authService.getAccessToken();
      http.Response response = await http.post(
        Uri.parse('$baseUrl/quizzes/$quizId/complete'),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'userId': userId}),
      );
      if (response.statusCode == 200) {
      } else {
        throw Exception('Failed to complete quiz');
      }
    } catch (e) {
      throw Exception('Failed to complete quiz: $e');
    }
  }

  Future<List<int>> getCompletedQuizzes(int userId) async {
    try {
      String? accessToken = await _authService.getAccessToken();
      final response = await http.get(
        Uri.parse('$baseUrl/quizzes/$userId/completed-quizzes?userId=$userId'),
        headers: {'Authorization': 'Bearer $accessToken'},
      );
      if (response.statusCode == 200) {
        List<dynamic> jsonData = jsonDecode(response.body);
        List<int> completedQuizzes =
            jsonData.map((quizId) => quizId as int).toList();
        return completedQuizzes;
      } else {
        throw Exception('Failed to fetch completed quizzes');
      }
    } catch (e) {
      throw Exception('Failed to fetch completed quizzes: $e');
    }
  }
}

class AttemptsInfo {
  final int attemptsLeft;
  final bool locked;
  final int timeLeft;

  AttemptsInfo({
    required this.attemptsLeft,
    required this.locked,
    required this.timeLeft,
  });

  factory AttemptsInfo.fromJson(Map<String, dynamic> json) {
    return AttemptsInfo(
      attemptsLeft: json['attemptsLeft'],
      locked: json['locked'],
      timeLeft: json['timeLeft'],
    );
  }
}

class CompletedQuizzes {
  final List<int> completedQuizzes;

  CompletedQuizzes({
    required this.completedQuizzes,
  });

  factory CompletedQuizzes.fromJson(List<dynamic> json) {
    return CompletedQuizzes(
      completedQuizzes: List<int>.from(json.map((x) => x)),
    );
  }
}
