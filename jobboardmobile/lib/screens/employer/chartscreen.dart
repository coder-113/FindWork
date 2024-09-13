import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:jobboardmobile/models/chart_model.dart';
import 'package:jobboardmobile/service/employer_service.dart';

class ChartScreen extends StatefulWidget {
  const ChartScreen({super.key});

  @override
  _ChartScreenState createState() => _ChartScreenState();
}

class _ChartScreenState extends State<ChartScreen> {
  late Future<ChartData> futureChartData;

  @override
  void initState() {
    super.initState();
    futureChartData = fetchChartData();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: Text('Chart CV'),
        backgroundColor: Color.fromARGB(255, 17, 172, 11), // Đổi màu nền của AppBar
      ),
      body: FutureBuilder<ChartData>(
        future: futureChartData,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildInfoBox('Job', snapshot.data!.jobCountData.reduce((a, b) => a + b)),
                      _buildInfoBox('CV', snapshot.data!.cvCountData.reduce((a, b) => a + b)),
                      _buildInfoBox('New CV', snapshot.data!.newCvCountData.reduce((a, b) => a + b)),
                      _buildInfoBox('Approved CV', snapshot.data!.approvedCvCountData.reduce((a, b) => a + b)),
                    ],
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        maxY: snapshot.data!.dataset1.reduce((a, b) => a > b ? a : b) * 1.2,
                        titlesData: FlTitlesData(
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 40,
                              getTitlesWidget: (value, meta) {
                                final index = value.toInt();
                                String label = snapshot.data!.labels[index];
                                // Chuyển đổi số không phải số nguyên thành "CV"
                                if (label.contains(RegExp(r'\d'))) {
                                  label = 'CV';
                                }
                                return SideTitleWidget(
                                  axisSide: meta.axisSide,
                                  child: Text(
                                    label,
                                    style: const TextStyle(fontSize: 12, color: Colors.black87), // Màu chữ
                                  ),
                                );
                              },
                            ),
                          ),
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 40,
                              getTitlesWidget: (value, meta) {
                                return SideTitleWidget(
                                  axisSide: meta.axisSide,
                                  child: Text(
                                    value.toStringAsFixed(0),
                                    style: const TextStyle(fontSize: 12, color: Colors.black87), // Màu chữ
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        borderData: FlBorderData(show: false),
                        barGroups: snapshot.data!.dataset1.asMap().entries.map((entry) {
                          int index = entry.key;
                          double value = entry.value.toDouble();
                          return BarChartGroupData(
                            x: index,
                            barRods: [
                              BarChartRodData(
                                toY: value,
                                color: Colors.blueAccent, // Màu thanh
                                width: screenWidth / (snapshot.data!.dataset1.length * 2.5), // Chiều rộng thanh theo kích thước màn hình
                              ),
                            ],
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ),
              ],
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          return Center(child: CircularProgressIndicator());
        },
      ),
    );
  }

  Widget _buildInfoBox(String title, int value) {
    return Container(
      padding: EdgeInsets.all(8.0),
      width: 80, // Đặt width cố định cho các ô thông tin
      decoration: BoxDecoration(
        color: Colors.deepPurple.shade50, // Màu nền của ô thông tin
        border: Border.all(color: Colors.deepPurple),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Column(
        children: [
          Text(
            title,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.deepPurple), // Màu chữ tiêu đề
          ),
          SizedBox(height: 8),
          Text(
            value.toString(),
            style: TextStyle(fontSize: 16, color: Colors.deepPurpleAccent), // Màu chữ giá trị
          ),
        ],
      ),
    );
  }
}
