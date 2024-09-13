import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/core/utils/color_util.dart';
import 'package:jobboardmobile/models/comment_model.dart';
import 'package:jobboardmobile/models/content_model.dart';
import 'package:jobboardmobile/models/user_model.dart';
import 'package:jobboardmobile/screens/blog-details/comment_widget.dart';
import 'package:jobboardmobile/screens/blog-details/full_screen_image_widget.dart';
import 'package:jobboardmobile/screens/blog/blog_list_widget.dart';
import 'package:jobboardmobile/screens/blog/blog_screen_widget.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/service/comment_service.dart';
import 'package:jobboardmobile/service/notification_service.dart';
import 'package:moment_dart/moment_dart.dart';

class BlogDetail extends StatefulWidget {
  final ContentModel blog;
  final String? commentId;

  const BlogDetail({super.key, required this.blog, this.commentId});

  @override
  _BlogDetailState createState() => _BlogDetailState();
}

class _BlogDetailState extends State<BlogDetail> {
  final AuthService _authService = AuthService();
  final ScrollController _scrollController = ScrollController();
  final NotificationService _notificationService = NotificationService();
  final Map<String, GlobalKey> _commentKeys = {};

  String? username;
  String? imageUrl;
  bool isShow = true;

  void _fetchUserDetails() async {
    username = await _authService.getUsername();
    imageUrl = await _authService.getImageUrl();
    setState(() {});
  }

  final CommentService _commentService = CommentService();
  TextEditingController commentEditingController = TextEditingController();
  FocusNode commentFocusNode = FocusNode();

  List<Comment> _comments = [];

  @override
  void initState() {
    super.initState();
    _loadComments();
    _fetchUserDetails();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToComment();
    });
  }

  Future<void> _refreshComments() async {
    // Fetch latest comments
    setState(() {
      _loadComments();
    });
  }

  void _scrollToComment() {
    if (widget.commentId != null &&
        _commentKeys.containsKey(widget.commentId)) {
      final context = _commentKeys[widget.commentId]!.currentContext;
      if (context != null) {
        Scrollable.ensureVisible(context, duration: const Duration(seconds: 1));
      }
    }
  }

  void _loadComments() async {
    try {
      List<Comment> comments =
          await _commentService.getCommentsByBlogSlug(widget.blog.slug);
      setState(() {
        _comments = comments;
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _scrollToComment();
      });
    } catch (e) {
      print('Failed to load comments: $e');
    }
  }

  void _addComment(String content) async {
    if (content.trim().isEmpty) {
      // Không thực hiện hành động nào nếu bình luận là trống
      return;
    }

    try {
      String temporaryCommentId = '${DateTime.now().millisecondsSinceEpoch}';

      var comment = {
        'id': temporaryCommentId,
        'blog': {
          'id': widget.blog.id,
          'user': {'username': widget.blog.user.username},
          'slug': widget.blog.slug
        },
        'content': content,
        'user': {'username': username},
      };
      Comment createdComment = await _commentService.createComment(comment);

      if (widget.blog.user.username != username) {
        _notificationService.sendNotification({
          'sender': {
            'username': username,
          },
          'recipient': {'username': widget.blog.user.username},
          'message': ' commented on your post.',
          'type': 'COMMENT',
          'url': '/blog/${widget.blog.slug}#comment-$temporaryCommentId'
        });
      }
      setState(() {
        _comments.add(createdComment);
      });

      commentEditingController.clear();
      commentFocusNode.unfocus();
    } catch (e) {
      print('Failed to add comment: $e');
    }
  }

  void _updateComment(String id, Comment updatedComment) async {
    try {
      Comment updated = await _commentService.updateComment(id, updatedComment);
      setState(() {
        int index = _comments.indexWhere((comment) => comment.id == updated.id);
        if (index != -1) {
          _comments[index] = updated;
        }
      });
    } catch (e) {
      print('Failed to update comment: $e');
    }
  }

  void _deleteComment(String id) async {
    try {
      await _commentService.deleteComment(id);

      setState(() {
        _comments = _removeCommentFromTree(_comments, id);
      });
    } catch (e) {
      print('Failed to delete comment: $e');
    }
  }

  List<Comment> _removeCommentFromTree(
      List<Comment> comments, String commentId) {
    return comments
        .map((comment) {
          if (comment.id == commentId) {
            return null;
          } else {
            return Comment(
              id: comment.id,
              content: comment.content,
              user: comment.user,
              createdAt: comment.createdAt,
              children: _removeCommentFromTree(comment.children, commentId),
              blog: comment.blog,
              updatedAt: comment.updatedAt,
            );
          }
        })
        .where((comment) => comment != null)
        .map((comment) => comment!)
        .toList();
  }

  void _toggleCommentField(bool isVisibility) {
    setState(() {
      isShow = isVisibility;
      if (!isShow) {
        commentFocusNode.unfocus();
      }
    });
  }

  String _calculateReadingTime(String content) {
    const int wordsPerMinute = 200; // Average reading speed
    final int words = content.split(' ').length;
    final int minutes = (words / wordsPerMinute).ceil();
    return '$minutes min read';
  }

  void _navigateToBlogScreenWithFilter(String filterType, String filterValue) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => BlogScreenWidget(
          query: filterType == 'tag' ? filterValue : "",
          category: filterType == 'category' ? filterValue : null,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const String defaultAvatarUrl =
        'https://w7.pngwing.com/pngs/613/636/png-transparent-computer-icons-user-profile-male-avatar-avatar-heroes-logo-black-thumbnail.png';

    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.blog.title,
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorUtil.primaryColor,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: RefreshIndicator(
        onRefresh: _refreshComments,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          controller: _scrollController,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) =>
                          FullScreenImage(imageUrl: widget.blog.imageUrl),
                    ),
                  );
                },
                child: Hero(
                  tag: widget.blog.imageUrl,
                  child: Image.network(widget.blog.imageUrl),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                widget.blog.title,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                '${Moment(widget.blog.createdAt).clone()} · ${_calculateReadingTime(widget.blog.content)}',
                style: const TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  CircleAvatar(
                    backgroundImage: widget.blog.user.imageUrl != null
                        ? NetworkImage(widget.blog.user.imageUrl!.replaceFirst(
                            "http://localhost:8080", Endpoint.imageUrl))
                        : const NetworkImage(defaultAvatarUrl),
                    radius: 20,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    "${widget.blog.user.firstName} ${widget.blog.user.lastName}",
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                widget.blog.citation,
                style: const TextStyle(fontStyle: FontStyle.italic),
              ),
              const SizedBox(height: 16),
              Html(
                data: widget.blog.content,
                style: {
                  "body": Style(
                      fontSize: FontSize(16.0),
                      listStyleType: ListStyleType.none),
                  "img": Style(
                    width: Width(345, Unit.percent), // Set the width to 100%
                    height: Height(200, Unit.px), // Maintain aspect ratio
                    display: Display.block,
                    margin: Margins.symmetric(vertical: 10),
                    alignment: Alignment.center, // Center the image
                  ),
                },
              ),
              if (widget.blog.categories.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: Wrap(
                    spacing: 8.0,
                    children: widget.blog.categories.map((category) {
                      return GestureDetector(
                        onTap: () => _navigateToBlogScreenWithFilter(
                            'category', category.name),
                        child: Chip(
                          label: Text(category.name),
                          backgroundColor: Colors.blue.shade100,
                        ),
                      );
                    }).toList(),
                  ),
                ),
              const SizedBox(height: 16),
              if (widget.blog.hashtags.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: Wrap(
                    spacing: 8.0,
                    children: widget.blog.hashtags.map((hashtag) {
                      return GestureDetector(
                        onTap: () => _navigateToBlogScreenWithFilter(
                            'tag', hashtag.name),
                        child: Chip(
                          label: Text('#${hashtag.name}'),
                          backgroundColor: Colors.green.shade100,
                        ),
                      );
                    }).toList(),
                  ),
                ),
              const SizedBox(height: 16),
              const Divider(),
              const Text(
                'Comments',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              Column(
                children: _comments.map((comment) {
                  // final key = GlobalKey();
                  // _commentKeys[comment.id] = key;
                  // print(_commentKeys[comment.id]);
                  return CommentWidget(
                    // key: key,
                    comment: comment,
                    deleteComment: _deleteComment,
                    toggleMainCommentField: _toggleCommentField,
                    blog: widget.blog,
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: MediaQuery.of(context).viewInsets,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              if (imageUrl != null)
                ClipOval(
                  child: Image.network(
                    imageUrl!.replaceFirst(
                      'http://localhost:8080',
                      Endpoint.imageUrl,
                    ),
                    fit: BoxFit.cover,
                    width: 40,
                    height: 40,
                  ),
                )
              else
                ClipOval(
                  child: Container(
                    color: Colors.grey[200],
                    width: 40,
                    height: 40,
                    child:
                        const Icon(Icons.person, size: 24, color: Colors.grey),
                  ),
                ),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(
                    hintText: 'Enter your comment',
                    border: OutlineInputBorder(),
                  ),
                  controller: commentEditingController,
                  focusNode: commentFocusNode,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.send),
                onPressed: () {
                  _addComment(commentEditingController.text);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
