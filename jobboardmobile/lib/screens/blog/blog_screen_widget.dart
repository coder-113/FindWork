import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:jobboardmobile/core/utils/color_util.dart';
import 'package:jobboardmobile/models/blog_model.dart';
import 'package:jobboardmobile/models/category_model.dart';
import 'package:jobboardmobile/models/content_model.dart';
import 'package:jobboardmobile/screens/blog/blog_list_widget.dart';
import 'package:jobboardmobile/service/blog_service.dart';

class BlogScreenWidget extends StatefulWidget {
  const BlogScreenWidget({super.key, this.query, this.category});
  final String? query;
  final String? category;
  @override
  _BlogScreenWidgetState createState() => _BlogScreenWidgetState();
}

class _BlogScreenWidgetState extends State<BlogScreenWidget> {
  final TextEditingController _queryController = TextEditingController();
  String _query = '';
  String _selectedCategory = 'ALL';
  String _order = 'asc';
  int _currentPage = 0;
  int _totalPages = 1;
  late Future<BlogModel> _futureBlogs;
  late Future<List<Category>> _futureCategories;
  List<Category> _categories = [];

  @override
  void initState() {
    super.initState();
    _fetchCategories();
    if (widget.query != null) {
      _queryController.text = widget.query!;
      _query = widget.query!;
    }
    if (widget.category != null) {
      _selectedCategory = widget.category!;
    }
    _fetchBlogs();
  }

  void _fetchCategories() {
    setState(() {
      _futureCategories = BlogService().getBlogCategories();
    });
  }

  void _fetchBlogs() {
    setState(() {
      _futureBlogs = BlogService().searchBlogs(
          _query, widget.category ?? _selectedCategory,
          order: _order, page: _currentPage);
    });
  }

  void _searchBlogs() {
    setState(() {
      _query = _queryController.text;
      _currentPage = 0;
      _fetchBlogs();
    });
  }

  void _nextPage() {
    if (_currentPage < _totalPages - 1) {
      setState(() {
        _currentPage++;
        _fetchBlogs();
      });
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      setState(() {
        _currentPage--;
        _fetchBlogs();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blog List', style: TextStyle(color: Colors.white)),
        backgroundColor: ColorUtil.primaryColor,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _queryController,
                    decoration: const InputDecoration(
                      labelText: 'Search Query',
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: _searchBlogs,
                  child: const Text('Search'),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: FutureBuilder<List<Category>>(
                    future: _futureCategories,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const CircularProgressIndicator();
                      } else if (snapshot.hasError) {
                        return Text('Error: ${snapshot.error}');
                      } else if (snapshot.hasData) {
                        _categories = snapshot.data!;
                        List<String> categoryNames = ['ALL'] +
                            _categories
                                .map((category) => category.name)
                                .toList();

                        return DropdownSearch<String>(
                          items: ['ALL'] +
                              _categories
                                  .map((category) => category.name)
                                  .toList(),
                          onChanged: (String? newValue) {
                            setState(() {
                              _selectedCategory = newValue!;
                              _currentPage = 0;
                              _fetchBlogs();
                            });
                          },
                          selectedItem: _selectedCategory,
                          dropdownBuilder: (context, selectedItem) =>
                              Text(selectedItem ?? 'Select Category'),
                        );
                      } else {
                        return const Text('No categories found');
                      }
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: DropdownSearch<String>(
                    items: const ['asc', 'desc'], // Sort order values
                    selectedItem: _order,
                    popupProps: PopupProps.menu(
                        menuProps: MenuProps(
                            elevation: 8,
                            backgroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8))),
                        constraints: const BoxConstraints(maxHeight: 100)),
                    onChanged: (String? newValue) {
                      setState(() {
                        _order = newValue!;
                        _currentPage = 0;
                        _fetchBlogs();
                      });
                    },

                    itemAsString: (String? order) {
                      switch (order) {
                        case 'asc':
                          return 'Oldest';
                        case 'desc':
                          return 'Newest';
                        default:
                          return '';
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: FutureBuilder<BlogModel>(
              future: _futureBlogs,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (snapshot.hasData && snapshot.data != null) {
                  _totalPages = snapshot.data!.totalPages;

                  if (snapshot.data!.content.isEmpty) {
                    return const Center(child: Text('No blogs found'));
                  }

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: BlogList(
                          blogs: snapshot.data!.content.map((content) {
                            return ContentModel(
                                content: content.content,
                                id: content.id,
                                imageUrl: content.imageUrl,
                                title: content.title,
                                createdAt: content.createdAt,
                                citation: content.citation,
                                user: content.user,
                                slug: content.slug,
                                categories: content.categories,
                                hashtags: content.hashtags,
                                thumbnailUrl: content.thumbnailUrl,
                                updatedAt: content.updatedAt);
                          }).toList(),
                        ),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ElevatedButton(
                            onPressed: _previousPage,
                            child: const Text('Previous'),
                          ),
                          Text('Page ${_currentPage + 1} of $_totalPages'),
                          ElevatedButton(
                            onPressed: _nextPage,
                            child: const Text('Next'),
                          ),
                        ],
                      ),
                    ],
                  );
                } else {
                  return const Center(child: Text('No blogs found'));
                }
              },
            ),
          )
        ],
      ),
    );
  }
}
