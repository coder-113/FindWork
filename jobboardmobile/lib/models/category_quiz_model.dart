import 'quiz_model.dart';

class CategoryQuiz {
  final int id;
  final String name;
  final List<Quiz> quizzes;

  CategoryQuiz({
    required this.id,
    required this.name,
    required this.quizzes,
  });

  factory CategoryQuiz.fromJson(Map<String, dynamic> json) {
    return CategoryQuiz(
      id: json['id'],
      name: json['name'],
      quizzes:
          (json['quizzes'] as List).map((quiz) => Quiz.fromJson(quiz)).toList(),
    );
  }
}
