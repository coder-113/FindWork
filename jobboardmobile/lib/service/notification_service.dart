// notification_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/notification_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';

class NotificationService {
  final String baseUrl = '${Endpoint.baseUrl}/notifications';

  Future<NotificationModel?> sendNotification(var notification) async {
    final AuthService authService = AuthService();

    String? accessToken = await authService.getAccessToken();

    final response = await http.post(
      Uri.parse('$baseUrl/send'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken'
      },
      body: jsonEncode(notification),
    );

    if (response.statusCode == 200) {
      return NotificationModel.fromJson(jsonDecode(response.body));
    } else {
      // Handle error
      return null;
    }
  }

  Future<List<NotificationModel>> getNotificationsByRecipientId(int id) async {
    final AuthService authService = AuthService();

    String? accessToken = await authService.getAccessToken();
    final response = await http.get(Uri.parse('$baseUrl/$id'),
        headers: {'Authorization': 'Bearer $accessToken'});
    
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      print("body: $body");
      return body.map((json) => NotificationModel.fromJson(json)).toList();
    } else {
      // Handle error
      return [];
    }
  }

  Future<NotificationModel?> markNotificationAsRead(int id) async {
    final AuthService authService = AuthService();

    String? accessToken = await authService.getAccessToken();
    final response = await http.put(Uri.parse('$baseUrl/read/$id'),
        headers: {'Authorization': 'Bearer $accessToken'});

    if (response.statusCode == 200) {
      return NotificationModel.fromJson(jsonDecode(response.body));
    } else {
      // Handle error
      return null;
    }
  }

  Future<bool> deleteNotification(int id) async {
    final AuthService authService = AuthService();

    String? accessToken = await authService.getAccessToken();
    final response = await http.delete(Uri.parse('$baseUrl/$id'),
        headers: {'Authorization': 'Bearer $accessToken'});

    return response.statusCode == 204;
  }
}
