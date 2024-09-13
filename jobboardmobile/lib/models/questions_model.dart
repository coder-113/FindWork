class Question {
  final int id;
  final String questionText;
  final String options;
  final String correctAnswer;

  Question({
    required this.id,
    required this.questionText,
    required this.options,
    required this.correctAnswer,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] ?? 0,
      questionText: json['questionText'] ?? '',
      options: json['options'] ?? '',
      correctAnswer: json['correctAnswer'] ?? '',
    );
  }

  List<String> getOptionsList() {
    return options.split(',');
  }
}
