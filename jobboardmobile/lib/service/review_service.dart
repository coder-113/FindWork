import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/review_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';

import '../dto/LikeResponse.dart';

class ReviewService {
  final String baseUrl = '${Endpoint.baseUrl}/companies';

  final String defaultImageUrl =
      'https://bootdey.com/img/Content/avatar/avatar6.png';
  Future<List<Review>> getAllReviews(int companyId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/$companyId/reviews'));

      print('Raw response: ${response.body}'); // Add this line

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        print('Decoded JSON: $jsonResponse'); // Add this line

        if (jsonResponse == null || jsonResponse is! List) {
          throw Exception('Invalid JSON format');
        }

        List<Review> reviews =
            jsonResponse.map((json) => Review.fromJson(json)).toList();
        return reviews;
      } else {
        throw Exception('Failed to load reviews');
      }
    } catch (e) {
      throw Exception('Failed to load reviews: $e');
    }
  }

  Future<Review> addReview(int companyId, Review review) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.post(
        Uri.parse('$baseUrl/$companyId/reviews'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken',
        },
        body: jsonEncode(review.toJson()),
      );

      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        var responseBody = jsonDecode(response.body);
        return Review.fromJson(responseBody);
      } else {
        throw Exception(
            'Failed to add review. Server responded with status code ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to add review: $e');
    }
  }

  Future<Review> getReview(int companyId, int reviewId) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.get(
        Uri.parse('$baseUrl/$companyId/reviews/$reviewId'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
      );

      if (response.statusCode == 200) {
        return Review.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to get review');
      }
    } catch (e) {
      throw Exception('Failed to get review: $e');
    }
  }

  Future<bool> hasUserReviewedCompany(int companyId) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.get(
        Uri.parse('$baseUrl/$companyId/reviews/hasReviewed'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken'
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as bool;
      } else {
        throw Exception('Failed to check if user has reviewed');
      }
    } catch (e) {
      throw Exception('Failed to check if user has reviewed: $e');
    }
  }

  Future<LikeResponse> likeReview(int companyId, int reviewId) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.post(
        Uri.parse('$baseUrl/$companyId/reviews/$reviewId/like'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken',
        },
      );

      print('Like review response: ${response.body}');

      if (response.statusCode == 200) {
        if (response.headers['content-type']?.contains('application/json') ??
            false) {
          return LikeResponse.fromJson(jsonDecode(response.body));
        } else {
          return LikeResponse(success: true, message: response.body);
        }
      } else {
        throw Exception(
            'Failed to like review. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Exception: $e');
      throw Exception('Failed to like review: $e');
    }
  }

  Future<LikeResponse> unlikeReview(int companyId, int reviewId) async {
    try {
      final AuthService authService = AuthService();
      String? accessToken = await authService.getAccessToken();

      final response = await http.delete(
        Uri.parse('$baseUrl/$companyId/reviews/$reviewId/unlike'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer $accessToken',
        },
      );

      print('Unlike review response: ${response.body}');

      if (response.statusCode == 200) {
        if (response.headers['content-type']?.contains('application/json') ??
            false) {
          return LikeResponse.fromJson(jsonDecode(response.body));
        } else {
          return LikeResponse(success: true, message: response.body);
        }
      } else {
        throw Exception(
            'Failed to unlike review. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Exception: $e');
      throw Exception('Failed to unlike review: $e');
    }
  }
}
