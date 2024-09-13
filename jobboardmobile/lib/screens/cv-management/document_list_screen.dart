import 'package:flutter/material.dart';
import '../../models/pdf_model.dart';
import '../../service/pdfDocument_service.dart';
import 'document_view_screen.dart';
import 'package:intl/intl.dart';

class DocumentListScreen extends StatefulWidget {
  @override
  _DocumentListScreenState createState() => _DocumentListScreenState();
}

class _DocumentListScreenState extends State<DocumentListScreen> {
  final PdfDocumentService _documentService = PdfDocumentService();
  late Future<List<PdfDocument>> _futureDocuments;
  int? userId;

  @override
  void initState() {
    super.initState();
    _initializeUserId();
    _futureDocuments = _documentService.fetchDocuments();
  }

  Future<void> _initializeUserId() async {
    int? id = await _documentService.getUserId();
    if (id != null) {
      setState(() {
        userId = id;
      });
    } else {
      print('User ID not found in storage');
    }
  }

  Widget documentCard(PdfDocument document) {
    String formattedDate = DateFormat('yyyy-MM-dd').format(document.createdAt);
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: EdgeInsets.all(16),
        title: Text(
          document.fileName,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Text(
          'Created at: $formattedDate',
          style: TextStyle(color: Colors.grey[600]),
        ),
        trailing: Icon(Icons.arrow_forward_ios, color: Color(0xFF89BA16)),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => DocumentViewScreen(documentId: document.id),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Text('My Documents', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Color(0xFF89BA16),
        elevation: 0,
      ),
      body: FutureBuilder<List<PdfDocument>>(
        future: _futureDocuments,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF89BA16)),
              ),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 48, color: Colors.red),
                  SizedBox(height: 16),
                  Text('Error: ${snapshot.error}', style: TextStyle(fontSize: 16)),
                ],
              ),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.folder_open, size: 48, color: Color(0xFF89BA16)),
                  SizedBox(height: 16),
                  Text('No documents found', style: TextStyle(fontSize: 16)),
                ],
              ),
            );
          } else {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                return documentCard(snapshot.data![index]);
              },
            );
          }
        },
      ),
    );
  }
}
