import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jobboardmobile/constant/endpoint.dart';
import '../models/company_model.dart';

class CompanyService {
  final String baseUrl = '${Endpoint.baseUrl}/companies';

  Future<List<Company>> getAllCompanies() async {
    final response = await http.get(Uri.parse(baseUrl));

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body) as List;
      return jsonResponse.map((company) => Company.fromJson(company)).toList();
    } else {
      throw Exception('Failed to load companies');
    }
  }

  Future<Company> getCompanyById(int companyId) async {
    final response = await http.get(Uri.parse('$baseUrl/$companyId'));

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      return Company.fromJson(jsonResponse);
    } else if (response.statusCode == 404) {
      throw Exception('Company not found');
    } else {
      throw Exception('Failed to load company');
    }
  }
}
