import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:jobboardmobile/models/company_model.dart';
import 'package:jobboardmobile/models/job_model.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/utils/color_util.dart';
import '../../service/job_service.dart';
import '../job/JobDetailsScreen.dart';
import 'company_review_screen.dart';
import '../../constant/endpoint.dart'; // Import your endpoint

class CompanyDetailsScreen extends StatefulWidget {
  final Company company;

  const CompanyDetailsScreen({Key? key, required this.company})
      : super(key: key);

  @override
  _CompanyDetailsScreenState createState() => _CompanyDetailsScreenState();
}

class _CompanyDetailsScreenState extends State<CompanyDetailsScreen> {
  final JobService _jobService = JobService();
  List<Job> _jobs = [];

  @override
  void initState() {
    super.initState();
    _fetchJobsForCompany();
  }

  Future<void> _fetchJobsForCompany() async {
    try {
      final allJobs = await _jobService.getAllJobs();
      final companyJobs = allJobs
          .where((job) => job.companyId == widget.company.companyId)
          .toList();
      setState(() {
        _jobs = companyJobs;
      });
    } catch (e) {
      print('Failed to load jobs: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    String companyName = widget.company.companyName ?? 'Company Name';
    String companyDescription = widget.company.description ?? 'No Description';
    String companyLogo = widget.company.logo ?? '';
    String companyLocation = widget.company.location ?? 'No Location';
    String companyWebsite = widget.company.websiteLink ?? 'No Website';
    String companyKeySkills = widget.company.keySkills ?? 'No Key Skills';
    String companyType = widget.company.type ?? 'No Type';
    String companySize = widget.company.companySize ?? 'No Company Size';
    String companyCountry = widget.company.country ?? 'No Country';
    String companyWorkingDays = widget.company.workingDays ?? 'No Working Days';

    String modifiedImageUrl =
        companyLogo.replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Scaffold(
      appBar: AppBar(
        title: Text(companyName),
        backgroundColor: ColorUtil.primaryColor,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.grey[300]!, width: 2),
                ),
                child: ClipOval(
                  child: Image.network(
                    modifiedImageUrl,
                    fit: BoxFit.cover,
                    width: 120,
                    height: 120,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            _buildInfoCard(
              'Company Name',
              companyName,
              icon: Icons.business,
              iconColor: Colors.blue,
            ),
            const SizedBox(height: 16),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CompanyReviewScreen(
                        companyId: widget.company.companyId,
                      ),
                    ),
                  );
                },
                child: Text('Review Company'),
              ),
            ),
            _buildInfoCard(
              'Description',
              companyDescription,
              isHtml: true,
              icon: Icons.description,
              iconColor: Colors.green,
            ),
            _buildInfoCard(
              'Location',
              companyLocation,
              icon: Icons.location_on,
              iconColor: Colors.blue,
            ),
            _buildInfoCard(
              'Website',
              companyWebsite,
              isLink: true,
              icon: Icons.web,
              iconColor: Colors.blue,
            ),
            _buildInfoCard(
              'Key Skills',
              companyKeySkills,
              icon: Icons.star,
              iconColor: Colors.orange,
            ),
            _buildInfoCard(
              'Type',
              companyType,
              icon: Icons.business_center,
              iconColor: Colors.purple,
            ),
            _buildInfoCard(
              'Company Size',
              companySize,
              icon: Icons.group,
              iconColor: Colors.teal,
            ),
            _buildInfoCard('Country', companyCountry, icon: Icons.public),
            _buildInfoCard(
              'Working Days',
              companyWorkingDays,
              icon: Icons.calendar_today,
              iconColor: Colors.deepOrange,
            ),
            const SizedBox(height: 16),
            Text(
              'Jobs at $companyName',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _jobs.isEmpty
                ? Center(child: Text('No jobs available'))
                : ListView.separated(
                    separatorBuilder: (context, index) => Divider(),
                    shrinkWrap: true,
                    itemCount: _jobs.length,
                    itemBuilder: (context, index) {
                      final job = _jobs[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        elevation: 5,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundImage: NetworkImage(modifiedImageUrl),
                            radius: 30,
                          ),
                          title: Text(
                            job.title ?? 'No Title',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                job.offeredSalary ?? 'No Salary',
                                style: TextStyle(color: Colors.green),
                              ),
                              // Html(
                              //   data: job.description ?? 'No Description',
                              //   style: {
                              //     "body": Style(
                              //         fontSize: FontSize(16.0),
                              //         listStyleType: ListStyleType.none),
                              //   },
                              // ),
                            ],
                          ),
                          isThreeLine: true,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => JobDetailsScreen(
                                  job: job,
                                  company: widget.company,
                                  isHtml: true,
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
            const SizedBox(height: 16),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => CompanyReviewScreen(
                        companyId: widget.company.companyId,
                      ),
                    ),
                  );
                },
                child: Text('Review Company'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(String title, String value,
      {bool isLink = false,
      bool isHtml = false,
      IconData? icon,
      Color? iconColor}) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 12.0),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (icon != null)
              Icon(
                icon,
                color: iconColor ?? Colors.black,
                size: 20,
              ),
            const SizedBox(width: 8),
            Expanded(
              child: isLink
                  ? InkWell(
                      onTap: () => _launchURL(value),
                      child: Text(
                        value,
                        style: TextStyle(color: Colors.blue, fontSize: 16),
                        overflow: TextOverflow
                            .ellipsis, // Ensure text doesn't overflow
                      ),
                    )
                  : isHtml
                      ? Html(
                          data: value,
                          style: {
                            "body": Style(
                              fontSize: FontSize(16.0),
                              listStyleType: ListStyleType.none,
                              padding: HtmlPaddings.all(0), // Updated padding
                              lineHeight: LineHeight(0),
                            ),
                          },
                          onLinkTap: (url, context, element) {
                            if (url != null) {
                              _launchURL(url);
                            }
                          },
                        )
                      : Text(
                          value,
                          style: TextStyle(fontSize: 16),
                          overflow: TextOverflow
                              .ellipsis, // Ensure text doesn't overflow
                        ),
            ),
          ],
        ),
      ),
    );
  }

  void _launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
