import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/service/company_service.dart';
import '../../core/utils/color_util.dart';
import '../../constant/endpoint.dart'; // Import your endpoint
import 'CompanyDetailsScreen.dart';

class CompanyListScreen extends StatefulWidget {
  const CompanyListScreen({Key? key}) : super(key: key);

  @override
  _CompanyListScreenState createState() => _CompanyListScreenState();
}

class _CompanyListScreenState extends State<CompanyListScreen> {
  final CompanyService _companyService = CompanyService();
  late Future<List<Company>> _companies;

  @override
  void initState() {
    super.initState();
    _companies = _companyService.getAllCompanies();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Companies'),
        backgroundColor: ColorUtil.primaryColor,
      ),
      body: FutureBuilder<List<Company>>(
        future: _companies,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No companies found'));
          } else {
            return ListView.separated(
              padding: const EdgeInsets.all(8.0),
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CompanyDetailsScreen(
                            company: snapshot.data![index]),
                      ),
                    );
                  },
                  child: _buildCompanyCard(snapshot.data![index]),
                );
              },
              separatorBuilder: (context, index) => const Divider(),
            );
          }
        },
      ),
    );
  }

  Widget _buildCompanyCard(Company company) {
    // Replace 'http://localhost:8080' with the actual endpoint URL
    String modifiedImageUrl =
        company.logo.replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Card(
      elevation: 2.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Image.network(
                  modifiedImageUrl,
                  height: 40,
                  width: 40,
                  fit: BoxFit.cover,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        company.companyName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        company.location,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            // Text(
            //   company.description,
            //   style: const TextStyle(fontSize: 14),
            // ),
            const SizedBox(height: 10),
            Text(
              'Website: ${company.websiteLink}',
              style: const TextStyle(fontSize: 14, color: Colors.blue),
            ),
            const SizedBox(height: 10),
            Text(
              'Key Skills: ${company.keySkills}',
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 10),
            Text(
              'Working Days: ${company.workingDays}',
              style: const TextStyle(fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}
