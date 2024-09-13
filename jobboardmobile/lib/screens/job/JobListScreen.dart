import 'package:flutter/material.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/job_model.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/screens/job/JobDetailsScreen.dart';
import 'package:jobboardmobile/service/job_service.dart';

class JobListScreen extends StatelessWidget {
  final List<Job> jobs;
  final List<Company> companies;

  const JobListScreen({super.key, required this.jobs, required this.companies});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Job List'),
      ),
      body: jobs.isEmpty
          ? const Center(child: Text('No job data!'))
          : ListView.builder(
              itemCount: jobs.length,
              itemBuilder: (context, index) {
                final job = jobs[index];
                final company = companies.firstWhere(
                  (company) => company.companyId == job.companyId,
                );

                return ListTile(
                  leading: company.logo.isNotEmpty
                      ? Image.network(
                          company.logo.replaceAll(
                              'http://localhost:8080', Endpoint.imageUrl),
                          height: 50,
                          width: 50,
                          fit: BoxFit.cover,
                        )
                      : const Icon(Icons.business),
                  title: Text(job.title),
                  subtitle: Text(job.position),
                  trailing: Text(company.companyName),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => JobDetailsScreen(
                          job: job,
                          company: company,
                          isHtml: false, // Adjust based on your requirements
                        ),
                      ),
                    );
                  },
                );
              },
            ),
    );
  }
}
