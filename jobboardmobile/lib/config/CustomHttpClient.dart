import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class CustomHttpClient {
  final String baseUrl;
  late http.Client client;

  CustomHttpClient({required this.baseUrl}) {
    client = http.Client();
  }

  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('accessToken');

    if (token != null) {
      return {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      };
    } else {
      return {
        'Content-Type': 'application/json',
      };
    }
  }

  Future<http.Response> get(String url) async {
    final headers = await _getHeaders();
    return client.get(Uri.parse(baseUrl + url), headers: headers);
  }

  Future<http.Response> post(String url, {dynamic body}) async {
    final headers = await _getHeaders();
    return client.post(Uri.parse(baseUrl + url), headers: headers, body: body);
  }
}
