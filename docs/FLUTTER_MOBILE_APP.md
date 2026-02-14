# 📱 E-Mart Flutter App - Complete Beginner's Guide

**Goal**: Build a native mobile app (iOS + Android) using Flutter & Dart

**Prerequisites**: Complete the web version first (you'll understand the concepts)

**Time**: 3-4 weeks (25-30 days)

**What is Flutter?**: Google's framework for building native mobile apps with one codebase

---

## 🤔 What is Flutter? (For Complete Beginners)

### Flutter vs React Native

| Feature | React Native | Flutter |
|---------|--------------|---------|
| Language | JavaScript/TypeScript | **Dart** (new language to learn) |
| Created by | Facebook | **Google** |
| UI | Native components | **Custom-drawn widgets** |
| Performance | Good | **Excellent** (compiles to native) |
| Hot Reload | ✅ Yes | ✅ Yes |
| Learning Curve | Easy (if you know React) | **Moderate** (new language + concepts) |

### Why Learn Flutter?

✅ **One codebase** → iOS + Android + Web + Desktop  
✅ **Beautiful UI** → Material Design & Cupertino built-in  
✅ **Fast performance** → Compiles to native code  
✅ **Hot reload** → See changes instantly  
✅ **Growing popularity** → Used by Google, Alibaba, BMW  

---

## 🛠️ Setup & Installation

### 1. Install Flutter SDK

**Windows**:
```bash
# Download from https://flutter.dev/docs/get-started/install/windows
# Extract to C:\src\flutter
# Add to PATH: C:\src\flutter\bin
```

**macOS**:
```bash
# Download from https://flutter.dev/docs/get-started/install/macos
cd ~/development
unzip ~/Downloads/flutter_macos_*.zip
export PATH="$PATH:`pwd`/flutter/bin"
```

**Linux**:
```bash
cd ~/development
tar xf ~/Downloads/flutter_linux_*.tar.xz
export PATH="$PATH:`pwd`/flutter/bin"
```

### 2. Verify Installation
```bash
flutter doctor
```

This checks for:
- ✅ Flutter SDK
- ✅ Android Studio
- ✅ Xcode (macOS only)
- ✅ VS Code or Android Studio

### 3. Install VS Code Extensions
- **Flutter** (by Dart Code)
- **Dart** (by Dart Code)

### 4. Create Your First Flutter App
```bash
cd ~/E-Mart-Rebuild
flutter create emart_flutter
cd emart_flutter
flutter run
```

You should see a demo app on your phone/emulator! 🎉

---

## 📚 Dart Language Basics (30 Minutes Crash Course)

### Variables & Types
```dart
// Dart is statically typed (like TypeScript)

// Variables
String name = 'John';
int age = 25;
double price = 99.99;
bool isActive = true;

// Type inference (var)
var email = 'john@example.com';  // Dart infers String

// Constants
const PI = 3.14159;  // Compile-time constant
final currentTime = DateTime.now();  // Runtime constant

// Nullable types (like TypeScript's ?)
String? nullableName;  // Can be null
String nonNullName = 'John';  // Cannot be null
```

### Functions
```dart
// Basic function
String greet(String name) {
  return 'Hello, $name!';
}

// Arrow function (like JavaScript =>)
String greet(String name) => 'Hello, $name!';

// Optional parameters
void printUser(String name, {int? age, String? email}) {
  print('Name: $name');
  if (age != null) print('Age: $age');
}

// Usage
printUser('John');  // Only name
printUser('John', age: 25);  // Name and age
printUser('John', age: 25, email: 'john@example.com');  // All
```

### Classes
```dart
// Class definition
class User {
  String name;
  String email;
  int age;
  
  // Constructor
  User(this.name, this.email, this.age);
  
  // Named constructor
  User.guest() : name = 'Guest', email = '', age = 0;
  
  // Method
  String getInfo() {
    return '$name ($email)';
  }
}

// Usage
var user = User('John', 'john@example.com', 25);
print(user.getInfo());  // John (john@example.com)

var guest = User.guest();
```

### Lists & Maps (like Arrays & Objects)
```dart
// List (like JavaScript array)
List<String> fruits = ['Apple', 'Banana', 'Orange'];
fruits.add('Mango');
print(fruits[0]);  // Apple

// Map (like JavaScript object)
Map<String, dynamic> user = {
  'name': 'John',
  'age': 25,
  'email': 'john@example.com',
};
print(user['name']);  // John

// List of objects
List<User> users = [
  User('John', 'john@example.com', 25),
  User('Jane', 'jane@example.com', 30),
];
```

### Async/Await (like JavaScript)
```dart
// Async function
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return 'Data loaded!';
}

// Usage
void loadData() async {
  String data = await fetchData();
  print(data);
}
```

**That's it!** You now know enough Dart to start building! 🎉

---

## Week 1: Flutter Basics (Days 1-7)

### Day 1: Understanding Widgets

**🎯 Concept**: Everything in Flutter is a Widget!

#### What is a Widget?
A widget is a building block of your UI. Like React components, but simpler.

**Two Types**:
1. **StatelessWidget**: Doesn't change (like a button label)
2. **StatefulWidget**: Can change (like a counter)

#### Your First Widget
```dart
// lib/main.dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Mart',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('E-Mart'),
      ),
      body: Center(
        child: Text(
          'Hello, Flutter!',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
```

**Key Widgets**:
- `MaterialApp`: Root of your app
- `Scaffold`: Basic page structure (AppBar + Body + BottomNav)
- `AppBar`: Top bar
- `Text`: Display text
- `Center`: Center child widget

#### Common Widgets
```dart
// Container (like a div)
Container(
  width: 100,
  height: 100,
  color: Colors.blue,
  child: Text('Box'),
)

// Row (horizontal layout)
Row(
  children: [
    Text('Item 1'),
    Text('Item 2'),
    Text('Item 3'),
  ],
)

// Column (vertical layout)
Column(
  children: [
    Text('Item 1'),
    Text('Item 2'),
    Text('Item 3'),
  ],
)

// Image
Image.network('https://example.com/image.jpg')

// Button
ElevatedButton(
  onPressed: () {
    print('Button pressed!');
  },
  child: Text('Click Me'),
)
```

#### Today's Tasks
- [ ] Create Flutter project
- [ ] Understand StatelessWidget
- [ ] Create HomeScreen with AppBar
- [ ] Add some Text and Button widgets
- [ ] Run on emulator/phone

---

### Day 2: Layouts & Styling

**🎯 Concept**: How to arrange widgets and make them look good

#### Padding & Margin
```dart
// Padding (inside spacing)
Padding(
  padding: EdgeInsets.all(16.0),  // All sides
  child: Text('Padded text'),
)

Padding(
  padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
  child: Text('Custom padding'),
)

// Container with margin (outside spacing)
Container(
  margin: EdgeInsets.all(16.0),
  padding: EdgeInsets.all(8.0),
  color: Colors.blue,
  child: Text('Box'),
)
```

#### Alignment & Sizing
```dart
// Align widget
Align(
  alignment: Alignment.topRight,
  child: Text('Top Right'),
)

// Sized box (fixed size)
SizedBox(
  width: 200,
  height: 100,
  child: Text('Fixed size'),
)

// Expanded (take remaining space)
Row(
  children: [
    Text('Left'),
    Expanded(
      child: Text('Takes remaining space'),
    ),
    Text('Right'),
  ],
)
```

#### Card Widget (Material Design)
```dart
Card(
  elevation: 4,  // Shadow
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(12),
  ),
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Column(
      children: [
        Text('Card Title', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        SizedBox(height: 8),
        Text('Card content goes here'),
      ],
    ),
  ),
)
```

#### Today's Tasks
- [ ] Create a product card widget
- [ ] Use Container, Padding, Card
- [ ] Add images and text
- [ ] Style with colors and fonts
- [ ] Make it look good!

---

### Day 3: Lists & GridView

**🎯 Concept**: Display multiple items (like products)

#### ListView (Scrollable list)
```dart
ListView(
  children: [
    ListTile(
      leading: Icon(Icons.person),
      title: Text('John Doe'),
      subtitle: Text('john@example.com'),
    ),
    ListTile(
      leading: Icon(Icons.person),
      title: Text('Jane Doe'),
      subtitle: Text('jane@example.com'),
    ),
  ],
)
```

#### ListView.builder (For large lists)
```dart
ListView.builder(
  itemCount: products.length,
  itemBuilder: (context, index) {
    return ProductCard(product: products[index]);
  },
)
```

#### GridView (Grid layout)
```dart
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,  // 2 columns
    crossAxisSpacing: 10,
    mainAxisSpacing: 10,
    childAspectRatio: 0.7,  // Width/Height ratio
  ),
  itemCount: products.length,
  itemBuilder: (context, index) {
    return ProductCard(product: products[index]);
  },
)
```

#### Product Card Example
```dart
class ProductCard extends StatelessWidget {
  final Product product;
  
  ProductCard({required this.product});
  
  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image
          Image.network(
            product.image,
            height: 150,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
          
          // Product info
          Padding(
            padding: EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: TextStyle(fontWeight: FontWeight.bold),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 4),
                Text(
                  '\$${product.salePrice}',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

#### Today's Tasks
- [ ] Create Product model class
- [ ] Create ProductCard widget
- [ ] Display products in GridView
- [ ] Add sample data (hardcoded for now)
- [ ] Make it scrollable

---

### Day 4: Navigation

**🎯 Concept**: Move between screens

#### Basic Navigation
```dart
// Navigate to new screen
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => ProductDetailScreen(product: product),
  ),
);

// Go back
Navigator.pop(context);
```

#### Named Routes (Better approach)
```dart
// main.dart
MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => HomeScreen(),
    '/products': (context) => ProductsScreen(),
    '/cart': (context) => CartScreen(),
    '/profile': (context) => ProfileScreen(),
  },
)

// Navigate
Navigator.pushNamed(context, '/products');

// Navigate with arguments
Navigator.pushNamed(
  context,
  '/product-detail',
  arguments: product,
);

// Receive arguments
final product = ModalRoute.of(context)!.settings.arguments as Product;
```

#### Bottom Navigation Bar
```dart
class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    ProductsScreen(),
    CartScreen(),
    ProfileScreen(),
  ];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Cart',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
```

#### Today's Tasks
- [ ] Set up named routes
- [ ] Create ProductDetailScreen
- [ ] Navigate from ProductCard to detail
- [ ] Add bottom navigation bar
- [ ] Test navigation flow

---

### Day 5: State Management (StatefulWidget)

**🎯 Concept**: Widgets that can change

#### StatefulWidget Example
```dart
class CounterScreen extends StatefulWidget {
  @override
  _CounterScreenState createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  int _counter = 0;  // State variable
  
  void _increment() {
    setState(() {  // Tell Flutter to rebuild
      _counter++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Count: $_counter', style: TextStyle(fontSize: 24)),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _increment,
              child: Text('Increment'),
            ),
          ],
        ),
      ),
    );
  }
}
```

#### Cart with State
```dart
class CartScreen extends StatefulWidget {
  @override
  _CartScreenState createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  List<CartItem> _cartItems = [];
  
  void _addToCart(Product product) {
    setState(() {
      _cartItems.add(CartItem(product: product, quantity: 1));
    });
  }
  
  void _removeFromCart(int index) {
    setState(() {
      _cartItems.removeAt(index);
    });
  }
  
  double get _total {
    return _cartItems.fold(0, (sum, item) => sum + (item.product.salePrice * item.quantity));
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Cart')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _cartItems.length,
              itemBuilder: (context, index) {
                return CartItemWidget(
                  item: _cartItems[index],
                  onRemove: () => _removeFromCart(index),
                );
              },
            ),
          ),
          Container(
            padding: EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total:', style: TextStyle(fontSize: 20)),
                Text('\$$_total', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

#### Today's Tasks
- [ ] Convert HomeScreen to StatefulWidget
- [ ] Add cart state
- [ ] Implement add to cart
- [ ] Implement remove from cart
- [ ] Calculate total

---

### Day 6: HTTP Requests (Connect to Django API)

**🎯 Concept**: Fetch data from your backend

#### Install HTTP Package
```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0  # Add this
```

Run: `flutter pub get`

#### Create API Service
```dart
// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://YOUR_IP:8000/api';
  
  // Get products
  Future<List<Product>> getProducts() async {
    final response = await http.get(Uri.parse('$baseUrl/products/'));
    
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products');
    }
  }
  
  // Get single product
  Future<Product> getProduct(String slug) async {
    final response = await http.get(Uri.parse('$baseUrl/products/$slug/'));
    
    if (response.statusCode == 200) {
      return Product.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load product');
    }
  }
  
  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login/'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Login failed');
    }
  }
}
```

#### Product Model with JSON
```dart
// lib/models/product.dart
class Product {
  final int id;
  final String name;
  final String slug;
  final String description;
  final double price;
  final double salePrice;
  final int discount;
  final String image;
  
  Product({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.price,
    required this.salePrice,
    required this.discount,
    required this.image,
  });
  
  // Convert JSON to Product
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      slug: json['slug'],
      description: json['description'],
      price: json['price'].toDouble(),
      salePrice: json['sale_price'].toDouble(),
      discount: json['discount'],
      image: json['image'],
    );
  }
  
  // Convert Product to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'description': description,
      'price': price,
      'sale_price': salePrice,
      'discount': discount,
      'image': image,
    };
  }
}
```

#### Fetch Products in Screen
```dart
class ProductsScreen extends StatefulWidget {
  @override
  _ProductsScreenState createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final ApiService _apiService = ApiService();
  List<Product> _products = [];
  bool _isLoading = true;
  String? _error;
  
  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }
  
  Future<void> _fetchProducts() async {
    try {
      final products = await _apiService.getProducts();
      setState(() {
        _products = products;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Center(child: CircularProgressIndicator());
    }
    
    if (_error != null) {
      return Center(child: Text('Error: $_error'));
    }
    
    return GridView.builder(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
      ),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        return ProductCard(product: _products[index]);
      },
    );
  }
}
```

#### Today's Tasks
- [ ] Install http package
- [ ] Create ApiService class
- [ ] Add fromJson to models
- [ ] Fetch products from API
- [ ] Display loading state
- [ ] Handle errors

---

### Day 7: Provider (State Management)

**🎯 Concept**: Share state across the app (like Zustand)

#### Install Provider
```yaml
# pubspec.yaml
dependencies:
  provider: ^6.1.0
```

#### Create Cart Provider
```dart
// lib/providers/cart_provider.dart
import 'package:flutter/foundation.dart';

class CartProvider with ChangeNotifier {
  List<CartItem> _items = [];
  
  List<CartItem> get items => _items;
  
  int get itemCount => _items.length;
  
  double get total {
    return _items.fold(0, (sum, item) => sum + (item.product.salePrice * item.quantity));
  }
  
  void addToCart(Product product, int quantity) {
    // Check if product already in cart
    final existingIndex = _items.indexWhere((item) => item.product.id == product.id);
    
    if (existingIndex >= 0) {
      // Update quantity
      _items[existingIndex].quantity += quantity;
    } else {
      // Add new item
      _items.add(CartItem(product: product, quantity: quantity));
    }
    
    notifyListeners();  // Tell widgets to rebuild
  }
  
  void removeFromCart(int productId) {
    _items.removeWhere((item) => item.product.id == productId);
    notifyListeners();
  }
  
  void updateQuantity(int productId, int quantity) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      _items[index].quantity = quantity;
      notifyListeners();
    }
  }
  
  void clear() {
    _items = [];
    notifyListeners();
  }
}
```

#### Setup Provider in main.dart
```dart
import 'package:provider/provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MyApp(),
    ),
  );
}
```

#### Use Provider in Widgets
```dart
// Add to cart
class ProductDetailScreen extends StatelessWidget {
  final Product product;
  
  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    
    return Scaffold(
      body: Column(
        children: [
          // Product details...
          
          ElevatedButton(
            onPressed: () {
              cartProvider.addToCart(product, 1);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Added to cart!')),
              );
            },
            child: Text('Add to Cart'),
          ),
        ],
      ),
    );
  }
}

// Display cart count
class CartIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<CartProvider>(
      builder: (context, cart, child) {
        return Stack(
          children: [
            Icon(Icons.shopping_cart),
            if (cart.itemCount > 0)
              Positioned(
                right: 0,
                child: Container(
                  padding: EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  constraints: BoxConstraints(minWidth: 16, minHeight: 16),
                  child: Text(
                    '${cart.itemCount}',
                    style: TextStyle(color: Colors.white, fontSize: 10),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}
```

#### Today's Tasks
- [ ] Install Provider package
- [ ] Create CartProvider
- [ ] Set up MultiProvider
- [ ] Use Provider in widgets
- [ ] Test state sharing

---

## Week 2: Advanced Features (Days 8-14)

### Day 8: Authentication
- Create login screen
- Create signup screen
- Store JWT token (shared_preferences package)
- Auto-login on app start

### Day 9: Product Detail Screen
- Full product details
- Image carousel
- Quantity selector
- Add to cart button

### Day 10: Cart Screen
- Display cart items
- Update quantity
- Remove items
- Calculate total

### Day 11: Wishlist
- Create WishlistProvider
- Add to wishlist button
- Wishlist screen
- Move to cart

### Day 12: Search & Filters
- Search bar
- Filter by category
- Filter by price
- Sort options

### Day 13: Forms & Validation
- Form widgets
- Validators
- Error messages
- Submit handling

### Day 14: Polish & Testing
- Loading states
- Error handling
- Pull to refresh
- Test on real device

---

## Week 3: Production (Days 15-21)

### Day 15-16: Animations
- Hero animations
- Page transitions
- Animated containers
- Shimmer loading

### Day 17-18: Local Storage
- shared_preferences (like localStorage)
- Save cart offline
- Cache images
- Offline mode

### Day 19-20: Build & Test
- Build for Android (APK)
- Build for iOS (IPA)
- Test on multiple devices
- Fix bugs

### Day 21: App Store Preparation
- App icons
- Splash screen
- Screenshots
- Store listing

---

## 🎯 Key Flutter Concepts Summary

### 1. Everything is a Widget
```dart
Text()  // Widget
Container()  // Widget
Row()  // Widget
Column()  // Widget
```

### 2. Two Types of Widgets
- **StatelessWidget**: Doesn't change
- **StatefulWidget**: Can change (has state)

### 3. State Management
- **setState()**: For simple state
- **Provider**: For app-wide state (like Zustand)

### 4. Navigation
```dart
Navigator.push()  // Go to screen
Navigator.pop()  // Go back
```

### 5. Async/Await
```dart
Future<void> fetchData() async {
  var data = await http.get(url);
}
```

---

## 📚 Essential Resources

- **Flutter Docs**: https://flutter.dev/docs
- **Dart Docs**: https://dart.dev/guides
- **Flutter Widget Catalog**: https://flutter.dev/docs/development/ui/widgets
- **Pub.dev** (packages): https://pub.dev/

---

## 🎓 Learning Path

1. **Complete web version first** (understand the concepts)
2. **Learn Dart basics** (30 minutes)
3. **Follow this guide day by day**
4. **Type every line yourself**
5. **Experiment and break things**
6. **Build your E-Mart Flutter app!**

---

**Start with Day 1 after completing the web version! Flutter is different but fun! 🚀📱**
