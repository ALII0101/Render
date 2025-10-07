# from flask import Flask, render_template, request, jsonify, redirect, url_for
# from flask_sqlalchemy import SQLAlchemy
# from decimal import Decimal

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///menu.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

# class Item(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     price = db.Column(db.Numeric(10, 2), nullable=False)
#     description = db.Column(db.Text)

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'name': self.name,
#             'price': float(self.price),
#             'description': self.description
#         }

# with app.app_context():
#     db.create_all()

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/api/items', methods=['GET'])
# def get_items():
#     items = Item.query.all()
#     return jsonify([item.to_dict() for item in items])

# @app.route('/api/items', methods=['POST'])
# def add_item():
#     data = request.get_json()
#     new_item = Item(
#         name=data['name'],
#         price=Decimal(data['price']),
#         description=data.get('description', '')
#     )
#     db.session.add(new_item)
#     db.session.commit()
#     return jsonify(new_item.to_dict()), 201

# @app.route('/api/items/<int:item_id>', methods=['PUT'])
# def update_item(item_id):
#     item = Item.query.get_or_404(item_id)
#     data = request.get_json()
    
#     item.name = data['name']
#     item.price = Decimal(data['price'])
#     item.description = data.get('description', '')
    
#     db.session.commit()
#     return jsonify(item.to_dict())

# @app.route('/api/items/<int:item_id>', methods=['DELETE'])
# def delete_item(item_id):
#     item = Item.query.get_or_404(item_id)
#     db.session.delete(item)
#     db.session.commit()
#     return jsonify({'message': 'Item deleted successfully'})

# if __name__ == '__main__':
#     app.run(debug=True)




# from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
# from flask_sqlalchemy import SQLAlchemy
# from decimal import Decimal
# import os
# from werkzeug.utils import secure_filename
# from datetime import datetime, timedelta
# import json

# # الحصول على المسار المطلق للملف الحالي
# base_dir = os.path.abspath(os.path.dirname(__file__))
# db_path = os.path.join(base_dir, 'instance', 'restaurant.db')

# print(f"📍 Database will be created at: {db_path}")

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['UPLOAD_FOLDER'] = 'uploads'
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
# app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# # Create necessary directories
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# os.makedirs('instance', exist_ok=True)

# db = SQLAlchemy(app)

# class Item(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     price = db.Column(db.Float, nullable=False)  # تغيير من Numeric إلى Float
#     description = db.Column(db.Text)
#     image_filename = db.Column(db.String(200))
#     category = db.Column(db.String(50), default='Main Course')
#     is_available = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     sales_count = db.Column(db.Integer, default=0)
#     last_ordered = db.Column(db.DateTime)

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'name': self.name,
#             'price': float(self.price),
#             'description': self.description,
#             'image_url': f"/uploads/{self.image_filename}" if self.image_filename else None,
#             'category': self.category,
#             'is_available': self.is_available,
#             'created_at': self.created_at.isoformat() if self.created_at else None,
#             'sales_count': self.sales_count,
#             'last_ordered': self.last_ordered.isoformat() if self.last_ordered else None
#         }

# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# @app.route('/')
# def index():
#     return render_template('index.html')

# # ITEMS API - SAVE TO DATABASE
# @app.route('/api/items', methods=['GET'])
# def get_items():
#     try:
#         category = request.args.get('category', 'all')
#         query = Item.query
        
#         if category != 'all':
#             query = query.filter_by(category=category)
        
#         items = query.order_by(Item.created_at.desc()).all()
#         return jsonify([item.to_dict() for item in items])
#     except Exception as e:
#         print(f"❌ Error getting items: {e}")
#         return jsonify({'error': 'Failed to fetch items'}), 500

# @app.route('/api/items/categories', methods=['GET'])
# def get_categories():
#     try:
#         categories = db.session.query(Item.category).distinct().all()
#         return jsonify([cat[0] for cat in categories])
#     except Exception as e:
#         print(f"❌ Error getting categories: {e}")
#         return jsonify({'error': 'Failed to fetch categories'}), 500

# @app.route('/api/items', methods=['POST'])
# def add_item():
#     try:
#         name = request.form.get('name')
#         price = request.form.get('price')
#         description = request.form.get('description', '')
#         category = request.form.get('category', 'Main Course')
#         is_available = request.form.get('is_available', 'true') == 'true'
        
#         if not name or not price:
#             return jsonify({'error': 'Name and price are required'}), 400

#         # Create new item
#         new_item = Item(
#             name=name,
#             price=float(price),  # استخدام float بدلاً من Decimal
#             description=description,
#             category=category,
#             is_available=is_available,
#             created_at=datetime.utcnow()
#         )

#         # Handle file upload
#         if 'image' in request.files:
#             file = request.files['image']
#             if file and file.filename != '' and allowed_file(file.filename):
#                 filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
#                 file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#                 new_item.image_filename = filename

#         # Save to database
#         db.session.add(new_item)
#         db.session.commit()
        
#         print(f"✅ Item saved to database: {name} (ID: {new_item.id})")
#         return jsonify(new_item.to_dict()), 201

#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error saving item to database: {e}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/items/<int:item_id>', methods=['PUT'])
# def update_item(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
        
#         if request.content_type.startswith('application/json'):
#             data = request.get_json()
#             item.name = data.get('name', item.name)
#             item.price = float(data.get('price', item.price))
#             item.description = data.get('description', item.description)
#             item.category = data.get('category', item.category)
#             item.is_available = data.get('is_available', item.is_available)
#         else:
#             item.name = request.form.get('name', item.name)
#             item.price = float(request.form.get('price', item.price))
#             item.description = request.form.get('description', item.description)
#             item.category = request.form.get('category', item.category)
#             item.is_available = request.form.get('is_available') == 'true'

#             if 'image' in request.files:
#                 file = request.files['image']
#                 if file and file.filename != '' and allowed_file(file.filename):
#                     if item.image_filename:
#                         old_file_path = os.path.join(app.config['UPLOAD_FOLDER'], item.image_filename)
#                         if os.path.exists(old_file_path):
#                             os.remove(old_file_path)
                    
#                     filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
#                     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#                     item.image_filename = filename

#         db.session.commit()
#         print(f"✅ Item updated in database: {item.name} (ID: {item.id})")
#         return jsonify(item.to_dict())

#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error updating item in database: {e}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/items/<int:item_id>/order', methods=['POST'])
# def record_order(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
#         item.sales_count += 1
#         item.last_ordered = datetime.utcnow()
#         db.session.commit()
#         print(f"✅ Order recorded for: {item.name} (Total sales: {item.sales_count})")
#         return jsonify(item.to_dict())
#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error recording order: {e}")
#         return jsonify({'error': 'Failed to record order'}), 500

# @app.route('/api/items/<int:item_id>/availability', methods=['PATCH'])
# def toggle_availability(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
#         item.is_available = not item.is_available
#         db.session.commit()
#         status = "available" if item.is_available else "unavailable"
#         print(f"✅ Availability updated: {item.name} is now {status}")
#         return jsonify(item.to_dict())
#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error toggling availability: {e}")
#         return jsonify({'error': 'Failed to update availability'}), 500

# @app.route('/api/items/<int:item_id>', methods=['DELETE'])
# def delete_item(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
#         item_name = item.name
        
#         if item.image_filename:
#             file_path = os.path.join(app.config['UPLOAD_FOLDER'], item.image_filename)
#             if os.path.exists(file_path):
#                 os.remove(file_path)
        
#         db.session.delete(item)
#         db.session.commit()
#         print(f"✅ Item deleted from database: {item_name} (ID: {item_id})")
#         return jsonify({'message': 'Item deleted successfully'})
#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error deleting item: {e}")
#         return jsonify({'error': 'Failed to delete item'}), 500

# # ANALYTICS API
# @app.route('/api/analytics/overview')
# def get_analytics_overview():
#     try:
#         total_items = Item.query.count()
#         available_items = Item.query.filter_by(is_available=True).count()
#         total_categories = db.session.query(Item.category).distinct().count()
#         total_sales = db.session.query(db.func.sum(Item.sales_count)).scalar() or 0
        
#         # Top selling items
#         top_items = Item.query.order_by(Item.sales_count.desc()).limit(5).all()
        
#         # Category distribution
#         categories = db.session.query(
#             Item.category, 
#             db.func.count(Item.id),
#             db.func.sum(Item.sales_count)
#         ).group_by(Item.category).all()
        
#         # Recent activity (last 7 days)
#         week_ago = datetime.utcnow() - timedelta(days=7)
#         recent_items = Item.query.filter(Item.created_at >= week_ago).count()
        
#         return jsonify({
#             'overview': {
#                 'total_items': total_items,
#                 'available_items': available_items,
#                 'total_categories': total_categories,
#                 'total_sales': total_sales,
#                 'recent_items': recent_items
#             },
#             'top_items': [{
#                 'name': item.name,
#                 'sales_count': item.sales_count,
#                 'price': float(item.price)
#             } for item in top_items],
#             'categories': [{
#                 'name': cat[0],
#                 'item_count': cat[1],
#                 'total_sales': cat[2] or 0
#             } for cat in categories]
#         })
#     except Exception as e:
#         print(f"❌ Error getting analytics: {e}")
#         return jsonify({'error': 'Failed to fetch analytics'}), 500

# # DATABASE INFO API - SHOW ALL ITEMS IN DATABASE
# @app.route('/api/database/info')
# def get_database_info():
#     try:
#         total_items = Item.query.count()
#         db_size = os.path.getsize(db_path) if os.path.exists(db_path) else 0
#         last_updated = datetime.utcnow().isoformat()
        
#         # Get database stats
#         categories = db.session.query(Item.category).distinct().count()
        
#         return jsonify({
#             'total_items': total_items,
#             'db_size_bytes': db_size,
#             'db_size_mb': round(db_size / (1024 * 1024), 2),
#             'last_updated': last_updated,
#             'categories_count': categories
#         })
#     except Exception as e:
#         print(f"❌ Error getting database info: {e}")
#         return jsonify({'error': 'Failed to fetch database info'}), 500

# @app.route('/api/database/items')
# def get_all_database_items():
#     try:
#         items = Item.query.order_by(Item.created_at.desc()).all()
#         return jsonify([{
#             'id': item.id,
#             'name': item.name,
#             'price': float(item.price),
#             'category': item.category,
#             'is_available': item.is_available,
#             'sales_count': item.sales_count,
#             'created_at': item.created_at.strftime('%Y-%m-%d %H:%M:%S') if item.created_at else 'N/A',
#             'last_ordered': item.last_ordered.strftime('%Y-%m-%d %H:%M:%S') if item.last_ordered else 'Never',
#             'description': item.description or 'No description',
#             'has_image': bool(item.image_filename)
#         } for item in items])
#     except Exception as e:
#         print(f"❌ Error getting database items: {e}")
#         return jsonify({'error': 'Failed to fetch database items'}), 500

# # Initialize database
# with app.app_context():
#     try:
#         db.create_all()
#         print("✅ Database initialized successfully!")
        
#         # Show current items count
#         item_count = Item.query.count()
#         print(f"📊 Current items in database: {item_count}")
        
#         # Add sample data if database is empty
#         if item_count == 0:
#             sample_items = [
#                 Item(name="Classic Burger", price=12.99, description="Juicy beef burger with fresh vegetables", category="Main Course", sales_count=45),
#                 Item(name="Caesar Salad", price=8.99, description="Fresh romaine lettuce with Caesar dressing", category="Salads", sales_count=32),
#                 Item(name="Chocolate Cake", price=6.99, description="Rich chocolate cake with vanilla icing", category="Desserts", sales_count=28),
#                 Item(name="French Fries", price=4.99, description="Crispy golden fries with sea salt", category="Appetizers", sales_count=67)
#             ]
#             db.session.bulk_save_objects(sample_items)
#             db.session.commit()
#             print("✅ Sample data added successfully!")
            
#     except Exception as e:
#         print(f"❌ Error initializing database: {e}")

# if __name__ == '__main__':
#     print("🚀 Starting Restaurant Management System...")
#     print(f"📁 Database: {db_path}")
#     print(f"📁 Uploads folder: {app.config['UPLOAD_FOLDER']}")
#     print(f"🌐 Web Interface: http://localhost:5000")
#     print("=" * 50)
#     app.run(debug=True, port=5000)






# from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
# from flask_sqlalchemy import SQLAlchemy
# from decimal import Decimal
# import os
# from werkzeug.utils import secure_filename
# from datetime import datetime, timedelta
# import json

# # الحصول على المسار المطلق للملف الحالي
# base_dir = os.path.abspath(os.path.dirname(__file__))
# db_path = os.path.join(base_dir, 'instance', 'restaurant.db')

# print(f"📍 Database will be created at: {db_path}")

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['UPLOAD_FOLDER'] = 'uploads'
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
# app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# # Create necessary directories
# os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
# os.makedirs('instance', exist_ok=True)

# db = SQLAlchemy(app)

# class Item(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     price = db.Column(db.Float, nullable=False)  # تغيير من Numeric إلى Float
#     description = db.Column(db.Text)
#     image_filename = db.Column(db.String(200))
#     category = db.Column(db.String(50), default='Main Course')
#     is_available = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     sales_count = db.Column(db.Integer, default=0)
#     last_ordered = db.Column(db.DateTime)

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'name': self.name,
#             'price': float(self.price),
#             'description': self.description,
#             'image_url': f"/uploads/{self.image_filename}" if self.image_filename else None,
#             'category': self.category,
#             'is_available': self.is_available,
#             'created_at': self.created_at.isoformat() if self.created_at else None,
#             'sales_count': self.sales_count,
#             'last_ordered': self.last_ordered.isoformat() if self.last_ordered else None
#         }

# def allowed_file(filename):
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# @app.route('/')
# def index():
#     return render_template('index.html')

# # ITEMS API - SAVE TO DATABASE
# @app.route('/api/items', methods=['GET'])
# def get_items():
#     try:
#         category = request.args.get('category', 'all')
#         query = Item.query
        
#         if category != 'all':
#             query = query.filter_by(category=category)
        
#         items = query.order_by(Item.created_at.desc()).all()
#         return jsonify([item.to_dict() for item in items])
#     except Exception as e:
#         print(f"❌ Error getting items: {e}")
#         return jsonify({'error': 'Failed to fetch items'}), 500

# @app.route('/api/items/categories', methods=['GET'])
# def get_categories():
#     try:
#         categories = db.session.query(Item.category).distinct().all()
#         return jsonify([cat[0] for cat in categories])
#     except Exception as e:
#         print(f"❌ Error getting categories: {e}")
#         return jsonify({'error': 'Failed to fetch categories'}), 500

# # CATEGORIES API - إضافة هذا الكود إلى app.py
# @app.route('/api/categories/stats')
# def get_categories_stats():
#     """Get detailed statistics for all categories"""
#     try:
#         categories_stats = db.session.query(
#             Item.category,
#             db.func.count(Item.id).label('item_count'),
#             db.func.sum(Item.sales_count).label('total_sales'),
#             db.func.avg(Item.price).label('avg_price'),
#             db.func.sum(db.cast(Item.is_available, db.Integer)).label('available_items')
#         ).group_by(Item.category).all()
        
#         result = []
#         for cat in categories_stats:
#             result.append({
#                 'name': cat.category,
#                 'item_count': cat.item_count or 0,
#                 'total_sales': cat.total_sales or 0,
#                 'avg_price': round(float(cat.avg_price) if cat.avg_price else 0, 2),
#                 'available_items': cat.available_items or 0,
#                 'unavailable_items': (cat.item_count or 0) - (cat.available_items or 0)
#             })
        
#         print(f"✅ Categories stats fetched: {len(result)} categories")
#         return jsonify(result)
#     except Exception as e:
#         print(f"❌ Error getting categories stats: {e}")
#         return jsonify({'error': 'Failed to fetch categories statistics'}), 500

# @app.route('/api/items', methods=['POST'])
# def add_item():
#     try:
#         name = request.form.get('name')
#         price = request.form.get('price')
#         description = request.form.get('description', '')
#         category = request.form.get('category', 'Main Course')
#         is_available = request.form.get('is_available', 'true') == 'true'
        
#         if not name or not price:
#             return jsonify({'error': 'Name and price are required'}), 400

#         # Create new item
#         new_item = Item(
#             name=name,
#             price=float(price),  # استخدام float بدلاً من Decimal
#             description=description,
#             category=category,
#             is_available=is_available,
#             created_at=datetime.utcnow()
#         )

#         # Handle file upload
#         if 'image' in request.files:
#             file = request.files['image']
#             if file and file.filename != '' and allowed_file(file.filename):
#                 filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
#                 file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#                 new_item.image_filename = filename

#         # Save to database
#         db.session.add(new_item)
#         db.session.commit()
        
#         print(f"✅ Item saved to database: {name} (ID: {new_item.id})")
#         return jsonify(new_item.to_dict()), 201

#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error saving item to database: {e}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/items/<int:item_id>', methods=['PUT'])
# def update_item(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
        
#         if request.content_type.startswith('application/json'):
#             data = request.get_json()
#             item.name = data.get('name', item.name)
#             item.price = float(data.get('price', item.price))
#             item.description = data.get('description', item.description)
#             item.category = data.get('category', item.category)
#             item.is_available = data.get('is_available', item.is_available)
#         else:
#             item.name = request.form.get('name', item.name)
#             item.price = float(request.form.get('price', item.price))
#             item.description = request.form.get('description', item.description)
#             item.category = request.form.get('category', item.category)
#             item.is_available = request.form.get('is_available') == 'true'

#             if 'image' in request.files:
#                 file = request.files['image']
#                 if file and file.filename != '' and allowed_file(file.filename):
#                     if item.image_filename:
#                         old_file_path = os.path.join(app.config['UPLOAD_FOLDER'], item.image_filename)
#                         if os.path.exists(old_file_path):
#                             os.remove(old_file_path)
                    
#                     filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
#                     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#                     item.image_filename = filename

#         db.session.commit()
#         print(f"✅ Item updated in database: {item.name} (ID: {item.id})")
#         return jsonify(item.to_dict())

#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error updating item in database: {e}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/items/<int:item_id>/order', methods=['POST'])
# def record_order(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
#         item.sales_count += 1
#         item.last_ordered = datetime.utcnow()
#         db.session.commit()
#         print(f"✅ Order recorded for: {item.name} (Total sales: {item.sales_count})")
#         return jsonify(item.to_dict())
#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error recording order: {e}")
#         return jsonify({'error': 'Failed to record order'}), 500

# @app.route('/api/items/<int:item_id>/availability', methods=['PATCH'])
# def toggle_availability(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
#         item.is_available = not item.is_available
#         db.session.commit()
#         status = "available" if item.is_available else "unavailable"
#         print(f"✅ Availability updated: {item.name} is now {status}")
#         return jsonify(item.to_dict())
#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error toggling availability: {e}")
#         return jsonify({'error': 'Failed to update availability'}), 500

# @app.route('/api/items/<int:item_id>', methods=['DELETE'])
# def delete_item(item_id):
#     try:
#         item = Item.query.get_or_404(item_id)
#         item_name = item.name
        
#         if item.image_filename:
#             file_path = os.path.join(app.config['UPLOAD_FOLDER'], item.image_filename)
#             if os.path.exists(file_path):
#                 os.remove(file_path)
        
#         db.session.delete(item)
#         db.session.commit()
#         print(f"✅ Item deleted from database: {item_name} (ID: {item_id})")
#         return jsonify({'message': 'Item deleted successfully'})
#     except Exception as e:
#         db.session.rollback()
#         print(f"❌ Error deleting item: {e}")
#         return jsonify({'error': 'Failed to delete item'}), 500

# # ANALYTICS API
# @app.route('/api/analytics/overview')
# def get_analytics_overview():
#     try:
#         total_items = Item.query.count()
#         available_items = Item.query.filter_by(is_available=True).count()
#         total_categories = db.session.query(Item.category).distinct().count()
#         total_sales = db.session.query(db.func.sum(Item.sales_count)).scalar() or 0
        
#         # Top selling items
#         top_items = Item.query.order_by(Item.sales_count.desc()).limit(5).all()
        
#         # Category distribution
#         categories = db.session.query(
#             Item.category, 
#             db.func.count(Item.id),
#             db.func.sum(Item.sales_count)
#         ).group_by(Item.category).all()
        
#         # Recent activity (last 7 days)
#         week_ago = datetime.utcnow() - timedelta(days=7)
#         recent_items = Item.query.filter(Item.created_at >= week_ago).count()
        
#         return jsonify({
#             'overview': {
#                 'total_items': total_items,
#                 'available_items': available_items,
#                 'total_categories': total_categories,
#                 'total_sales': total_sales,
#                 'recent_items': recent_items
#             },
#             'top_items': [{
#                 'name': item.name,
#                 'sales_count': item.sales_count,
#                 'price': float(item.price)
#             } for item in top_items],
#             'categories': [{
#                 'name': cat[0],
#                 'item_count': cat[1],
#                 'total_sales': cat[2] or 0
#             } for cat in categories]
#         })
#     except Exception as e:
#         print(f"❌ Error getting analytics: {e}")
#         return jsonify({'error': 'Failed to fetch analytics'}), 500

# # DATABASE INFO API - SHOW ALL ITEMS IN DATABASE
# @app.route('/api/database/info')
# def get_database_info():
#     try:
#         total_items = Item.query.count()
#         db_size = os.path.getsize(db_path) if os.path.exists(db_path) else 0
#         last_updated = datetime.utcnow().isoformat()
        
#         # Get database stats
#         categories = db.session.query(Item.category).distinct().count()
        
#         return jsonify({
#             'total_items': total_items,
#             'db_size_bytes': db_size,
#             'db_size_mb': round(db_size / (1024 * 1024), 2),
#             'last_updated': last_updated,
#             'categories_count': categories
#         })
#     except Exception as e:
#         print(f"❌ Error getting database info: {e}")
#         return jsonify({'error': 'Failed to fetch database info'}), 500

# @app.route('/api/database/items')
# def get_all_database_items():
#     try:
#         items = Item.query.order_by(Item.created_at.desc()).all()
#         return jsonify([{
#             'id': item.id,
#             'name': item.name,
#             'price': float(item.price),
#             'category': item.category,
#             'is_available': item.is_available,
#             'sales_count': item.sales_count,
#             'created_at': item.created_at.strftime('%Y-%m-%d %H:%M:%S') if item.created_at else 'N/A',
#             'last_ordered': item.last_ordered.strftime('%Y-%m-%d %H:%M:%S') if item.last_ordered else 'Never',
#             'description': item.description or 'No description',
#             'has_image': bool(item.image_filename)
#         } for item in items])
#     except Exception as e:
#         print(f"❌ Error getting database items: {e}")
#         return jsonify({'error': 'Failed to fetch database items'}), 500

# # Initialize database
# with app.app_context():
#     try:
#         db.create_all()
#         print("✅ Database initialized successfully!")
        
#         # Show current items count
#         item_count = Item.query.count()
#         print(f"📊 Current items in database: {item_count}")
        
#         # Add sample data if database is empty
#         if item_count == 0:
#             sample_items = [
#                 Item(name="Classic Burger", price=12.99, description="Juicy beef burger with fresh vegetables", category="Main Course", sales_count=45),
#                 Item(name="Caesar Salad", price=8.99, description="Fresh romaine lettuce with Caesar dressing", category="Salads", sales_count=32),
#                 Item(name="Chocolate Cake", price=6.99, description="Rich chocolate cake with vanilla icing", category="Desserts", sales_count=28),
#                 Item(name="French Fries", price=4.99, description="Crispy golden fries with sea salt", category="Appetizers", sales_count=67)
#             ]
#             db.session.bulk_save_objects(sample_items)
#             db.session.commit()
#             print("✅ Sample data added successfully!")
            
#     except Exception as e:
#         print(f"❌ Error initializing database: {e}")

# if __name__ == '__main__':
#     print("🚀 Starting Restaurant Management System...")
#     print(f"📁 Database: {db_path}")
#     print(f"📁 Uploads folder: {app.config['UPLOAD_FOLDER']}")
#     print(f"🌐 Web Interface: http://localhost:5000")
#     print("=" * 50)
#     app.run(debug=True, port=5000)






from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from decimal import Decimal
import os
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import json
import random  # إضافة لبيانات المبيعات الوهمية

# الحصول على المسار المطلق للملف الحالي
base_dir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(base_dir, 'instance', 'restaurant.db')

print(f"📍 Database will be created at: {db_path}")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create necessary directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('instance', exist_ok=True)

db = SQLAlchemy(app)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)  # تغيير من Numeric إلى Float
    description = db.Column(db.Text)
    image_filename = db.Column(db.String(200))
    category = db.Column(db.String(50), default='Main Course')
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sales_count = db.Column(db.Integer, default=0)
    last_ordered = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': float(self.price),
            'description': self.description,
            'image_url': f"/uploads/{self.image_filename}" if self.image_filename else None,
            'category': self.category,
            'is_available': self.is_available,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'sales_count': self.sales_count,
            'last_ordered': self.last_ordered.isoformat() if self.last_ordered else None
        }

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/')
def index():
    return render_template('index.html')

# ITEMS API - SAVE TO DATABASE
@app.route('/api/items', methods=['GET'])
def get_items():
    try:
        category = request.args.get('category', 'all')
        query = Item.query
        
        if category != 'all':
            query = query.filter_by(category=category)
        
        items = query.order_by(Item.created_at.desc()).all()
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        print(f"❌ Error getting items: {e}")
        return jsonify({'error': 'Failed to fetch items'}), 500

@app.route('/api/items/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Item.category).distinct().all()
        return jsonify([cat[0] for cat in categories])
    except Exception as e:
        print(f"❌ Error getting categories: {e}")
        return jsonify({'error': 'Failed to fetch categories'}), 500

# CATEGORIES API - إضافة هذا الكود إلى app.py
@app.route('/api/categories/stats')
def get_categories_stats():
    """Get detailed statistics for all categories"""
    try:
        categories_stats = db.session.query(
            Item.category,
            db.func.count(Item.id).label('item_count'),
            db.func.sum(Item.sales_count).label('total_sales'),
            db.func.avg(Item.price).label('avg_price'),
            db.func.sum(db.cast(Item.is_available, db.Integer)).label('available_items')
        ).group_by(Item.category).all()
        
        result = []
        for cat in categories_stats:
            result.append({
                'name': cat.category,
                'item_count': cat.item_count or 0,
                'total_sales': cat.total_sales or 0,
                'avg_price': round(float(cat.avg_price) if cat.avg_price else 0, 2),
                'available_items': cat.available_items or 0,
                'unavailable_items': (cat.item_count or 0) - (cat.available_items or 0)
            })
        
        print(f"✅ Categories stats fetched: {len(result)} categories")
        return jsonify(result)
    except Exception as e:
        print(f"❌ Error getting categories stats: {e}")
        return jsonify({'error': 'Failed to fetch categories statistics'}), 500

# Add these routes to your app.py

@app.route('/api/analytics/sales-data')
def get_sales_data():
    """Get sales data for the last 30 days"""
    try:
        # In a real app, you'd query actual order data
        # For now, we'll generate realistic mock data
        
        sales_data = []
        base_date = datetime.utcnow() - timedelta(days=30)
        
        # Generate realistic sales data with some trends
        base_sales = 20
        for i in range(30):
            date = base_date + timedelta(days=i)
            
            # Create some realistic patterns: weekends higher, some random variation
            day_of_week = date.weekday()
            weekend_boost = 1.3 if day_of_week >= 5 else 1.0  # Saturday/Sunday boost
            random_variation = random.uniform(0.8, 1.2)
            
            daily_sales = int(base_sales * weekend_boost * random_variation)
            
            sales_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'sales': daily_sales,
                'revenue': round(daily_sales * random.uniform(15, 25), 2)  # Average order value
            })
        
        print("✅ Sales data generated successfully")
        return jsonify(sales_data)
    except Exception as e:
        print(f"❌ Error generating sales data: {e}")
        return jsonify({'error': 'Failed to generate sales data'}), 500

@app.route('/api/analytics/performance')
def get_performance_metrics():
    """Get performance metrics and KPIs"""
    try:
        total_items = Item.query.count()
        available_items = Item.query.filter_by(is_available=True).count()
        total_sales = db.session.query(db.func.sum(Item.sales_count)).scalar() or 0
        
        # Calculate average price
        avg_price_result = db.session.query(db.func.avg(Item.price)).scalar()
        avg_price = float(avg_price_result) if avg_price_result else 0
        
        # Popular items (top 5 by sales)
        popular_items = Item.query.order_by(Item.sales_count.desc()).limit(5).all()
        
        # Revenue calculation (simplified)
        estimated_revenue = total_sales * avg_price
        
        # Category performance
        categories = db.session.query(
            Item.category,
            db.func.count(Item.id).label('item_count'),
            db.func.sum(Item.sales_count).label('total_sales')
        ).group_by(Item.category).all()
        
        metrics = {
            'metrics': {
                'total_revenue': round(estimated_revenue, 2),
                'total_orders': total_sales,
                'avg_order_value': round(avg_price, 2),
                'available_rate': round((available_items / total_items * 100), 2) if total_items > 0 else 0,
                'total_customers': total_sales * 2  # Estimate 2 items per order
            },
            'popular_items': [{
                'name': item.name,
                'sales': item.sales_count,
                'revenue': round(float(item.price) * item.sales_count, 2)
            } for item in popular_items],
            'category_performance': [{
                'category': cat[0],
                'items': cat[1],
                'sales': cat[2] or 0,
                'market_share': round((cat[2] or 0) / total_sales * 100, 2) if total_sales > 0 else 0
            } for cat in categories]
        }
        
        print("✅ Performance metrics fetched successfully")
        return jsonify(metrics)
    except Exception as e:
        print(f"❌ Error getting performance metrics: {e}")
        return jsonify({'error': 'Failed to fetch performance metrics'}), 500

@app.route('/api/items', methods=['POST'])
def add_item():
    try:
        name = request.form.get('name')
        price = request.form.get('price')
        description = request.form.get('description', '')
        category = request.form.get('category', 'Main Course')
        is_available = request.form.get('is_available', 'true') == 'true'
        
        if not name or not price:
            return jsonify({'error': 'Name and price are required'}), 400

        # Create new item
        new_item = Item(
            name=name,
            price=float(price),  # استخدام float بدلاً من Decimal
            description=description,
            category=category,
            is_available=is_available,
            created_at=datetime.utcnow()
        )

        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                new_item.image_filename = filename

        # Save to database
        db.session.add(new_item)
        db.session.commit()
        
        print(f"✅ Item saved to database: {name} (ID: {new_item.id})")
        return jsonify(new_item.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error saving item to database: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    try:
        item = Item.query.get_or_404(item_id)
        
        if request.content_type.startswith('application/json'):
            data = request.get_json()
            item.name = data.get('name', item.name)
            item.price = float(data.get('price', item.price))
            item.description = data.get('description', item.description)
            item.category = data.get('category', item.category)
            item.is_available = data.get('is_available', item.is_available)
        else:
            item.name = request.form.get('name', item.name)
            item.price = float(request.form.get('price', item.price))
            item.description = request.form.get('description', item.description)
            item.category = request.form.get('category', item.category)
            item.is_available = request.form.get('is_available') == 'true'

            if 'image' in request.files:
                file = request.files['image']
                if file and file.filename != '' and allowed_file(file.filename):
                    if item.image_filename:
                        old_file_path = os.path.join(app.config['UPLOAD_FOLDER'], item.image_filename)
                        if os.path.exists(old_file_path):
                            os.remove(old_file_path)
                    
                    filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    item.image_filename = filename

        db.session.commit()
        print(f"✅ Item updated in database: {item.name} (ID: {item.id})")
        return jsonify(item.to_dict())

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating item in database: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/items/<int:item_id>/order', methods=['POST'])
def record_order(item_id):
    try:
        item = Item.query.get_or_404(item_id)
        item.sales_count += 1
        item.last_ordered = datetime.utcnow()
        db.session.commit()
        print(f"✅ Order recorded for: {item.name} (Total sales: {item.sales_count})")
        return jsonify(item.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error recording order: {e}")
        return jsonify({'error': 'Failed to record order'}), 500

@app.route('/api/items/<int:item_id>/availability', methods=['PATCH'])
def toggle_availability(item_id):
    try:
        item = Item.query.get_or_404(item_id)
        item.is_available = not item.is_available
        db.session.commit()
        status = "available" if item.is_available else "unavailable"
        print(f"✅ Availability updated: {item.name} is now {status}")
        return jsonify(item.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error toggling availability: {e}")
        return jsonify({'error': 'Failed to update availability'}), 500

@app.route('/api/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    try:
        item = Item.query.get_or_404(item_id)
        item_name = item.name
        
        if item.image_filename:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], item.image_filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        
        db.session.delete(item)
        db.session.commit()
        print(f"✅ Item deleted from database: {item_name} (ID: {item_id})")
        return jsonify({'message': 'Item deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error deleting item: {e}")
        return jsonify({'error': 'Failed to delete item'}), 500

# ANALYTICS API
@app.route('/api/analytics/overview')
def get_analytics_overview():
    try:
        total_items = Item.query.count()
        available_items = Item.query.filter_by(is_available=True).count()
        total_categories = db.session.query(Item.category).distinct().count()
        total_sales = db.session.query(db.func.sum(Item.sales_count)).scalar() or 0
        
        # Top selling items
        top_items = Item.query.order_by(Item.sales_count.desc()).limit(5).all()
        
        # Category distribution
        categories = db.session.query(
            Item.category, 
            db.func.count(Item.id),
            db.func.sum(Item.sales_count)
        ).group_by(Item.category).all()
        
        # Recent activity (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_items = Item.query.filter(Item.created_at >= week_ago).count()
        
        return jsonify({
            'overview': {
                'total_items': total_items,
                'available_items': available_items,
                'total_categories': total_categories,
                'total_sales': total_sales,
                'recent_items': recent_items
            },
            'top_items': [{
                'name': item.name,
                'sales_count': item.sales_count,
                'price': float(item.price)
            } for item in top_items],
            'categories': [{
                'name': cat[0],
                'item_count': cat[1],
                'total_sales': cat[2] or 0
            } for cat in categories]
        })
    except Exception as e:
        print(f"❌ Error getting analytics: {e}")
        return jsonify({'error': 'Failed to fetch analytics'}), 500

# DATABASE INFO API - SHOW ALL ITEMS IN DATABASE
@app.route('/api/database/info')
def get_database_info():
    try:
        total_items = Item.query.count()
        db_size = os.path.getsize(db_path) if os.path.exists(db_path) else 0
        last_updated = datetime.utcnow().isoformat()
        
        # Get database stats
        categories = db.session.query(Item.category).distinct().count()
        
        return jsonify({
            'total_items': total_items,
            'db_size_bytes': db_size,
            'db_size_mb': round(db_size / (1024 * 1024), 2),
            'last_updated': last_updated,
            'categories_count': categories
        })
    except Exception as e:
        print(f"❌ Error getting database info: {e}")
        return jsonify({'error': 'Failed to fetch database info'}), 500

@app.route('/api/database/items')
def get_all_database_items():
    try:
        items = Item.query.order_by(Item.created_at.desc()).all()
        return jsonify([{
            'id': item.id,
            'name': item.name,
            'price': float(item.price),
            'category': item.category,
            'is_available': item.is_available,
            'sales_count': item.sales_count,
            'created_at': item.created_at.strftime('%Y-%m-%d %H:%M:%S') if item.created_at else 'N/A',
            'last_ordered': item.last_ordered.strftime('%Y-%m-%d %H:%M:%S') if item.last_ordered else 'Never',
            'description': item.description or 'No description',
            'has_image': bool(item.image_filename)
        } for item in items])
    except Exception as e:
        print(f"❌ Error getting database items: {e}")
        return jsonify({'error': 'Failed to fetch database items'}), 500

# Initialize database
with app.app_context():
    try:
        db.create_all()
        print("✅ Database initialized successfully!")
        
        # Show current items count
        item_count = Item.query.count()
        print(f"📊 Current items in database: {item_count}")
        
        # Add sample data if database is empty
        if item_count == 0:
            sample_items = [
                Item(name="Classic Burger", price=12.99, description="Juicy beef burger with fresh vegetables", category="Main Course", sales_count=45),
                Item(name="Caesar Salad", price=8.99, description="Fresh romaine lettuce with Caesar dressing", category="Salads", sales_count=32),
                Item(name="Chocolate Cake", price=6.99, description="Rich chocolate cake with vanilla icing", category="Desserts", sales_count=28),
                Item(name="French Fries", price=4.99, description="Crispy golden fries with sea salt", category="Appetizers", sales_count=67)
            ]
            db.session.bulk_save_objects(sample_items)
            db.session.commit()
            print("✅ Sample data added successfully!")
            
    except Exception as e:
        print(f"❌ Error initializing database: {e}")

if __name__ == '__main__':
    print("🚀 Starting Restaurant Management System...")
    print(f"📁 Database: {db_path}")
    print(f"📁 Uploads folder: {app.config['UPLOAD_FOLDER']}")
    print(f"🌐 Web Interface: http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)