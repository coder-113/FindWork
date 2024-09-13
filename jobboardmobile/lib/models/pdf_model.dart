class PdfDocument {
  final int id;
  final int userId;
  final String fileName;
  final String pdfContent;
  final DateTime createdAt;

  PdfDocument({
    required this.id,
    required this.userId,
    required this.fileName,
    required this.pdfContent,
    required this.createdAt,
  });

  factory PdfDocument.fromJson(Map<String, dynamic> json) {
    return PdfDocument(
      id: json['id'],
      userId: json['userId'],
      fileName: json['fileName'],
      pdfContent: json['pdfContent'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}