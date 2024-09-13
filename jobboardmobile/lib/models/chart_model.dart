class ChartData {
  final List<String> labels;
  final List<int> dataset1;
  final List<int> jobCountData;
  final List<int> cvCountData;
  final List<int> newCvCountData;
  final List<int> approvedCvCountData;

  ChartData({
    required this.labels,
    required this.dataset1,
    required this.jobCountData,
    required this.cvCountData,
    required this.newCvCountData,
    required this.approvedCvCountData,
  });

  factory ChartData.fromJson(Map<String, dynamic> json) {
    return ChartData(
      labels: List<String>.from(json['labels']),
      dataset1: List<int>.from(json['dataset1'].map((x) => x as int)),
      jobCountData: List<int>.from(json['jobCountData'].map((x) => x as int)),
      cvCountData: List<int>.from(json['cvCountData'].map((x) => x as int)),
      newCvCountData: List<int>.from(json['newCvCountData'].map((x) => x as int)),
      approvedCvCountData: List<int>.from(json['approvedCvCountData'].map((x) => x as int)),
    );
  }
}
