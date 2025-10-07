import os
import sys
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Item

def init_database():
    """Initialize database with empty tables"""
    with app.app_context():
        print("🔄 Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")
        print("📁 Database file: instance/restaurant.db")
        
        # Check current items
        items = Item.query.all()
        print(f"📊 Current items in database: {len(items)}")
        
        if items:
            print("\n📋 Existing items:")
            print("-" * 80)
            for item in items:
                print(f"ID: {item.id:2} | {item.name:20} | ${item.price:5} | {item.category:12} | Available: {'Yes' if item.is_available else 'No'}")
            print("-" * 80)

def reset_database():
    """Completely reset the database (DANGEROUS - deletes all data)"""
    with app.app_context():
        print("🗑️  Dropping all tables...")
        db.drop_all()
        
        print("🔄 Creating new tables...")
        db.create_all()
        
        print("✅ Database reset successfully!")
        print("💡 Database is now empty. Add items through the web interface.")

def add_sample_data():
    """Add sample data if needed"""
    with app.app_context():
        sample_items = [
            Item(
                name="Classic Burger",
                price=12.99,
                description="Juicy beef burger with fresh vegetables",
                category="Main Course",
                sales_count=45,
                last_ordered=datetime.utcnow()
            ),
            Item(
                name="Caesar Salad",
                price=8.99,
                description="Fresh romaine lettuce with Caesar dressing",
                category="Salads",
                sales_count=32,
                last_ordered=datetime.utcnow()
            )
        ]
        
        try:
            db.session.bulk_save_objects(sample_items)
            db.session.commit()
            print("✅ Sample data added successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error adding sample data: {e}")

if __name__ == '__main__':
    print("🚀 Restaurant Management System - Database Setup")
    print("=" * 50)
    
    print("\n📝 Choose an option:")
    print("1. Initialize database (safe - keeps existing data)")
    print("2. Reset database (DANGEROUS - deletes all data)")
    print("3. Add sample data")
    
    choice = input("\nEnter your choice (1, 2, or 3): ").strip()
    
    if choice == "1":
        init_database()
    elif choice == "2":
        confirm = input("⚠️  This will DELETE ALL DATA. Type 'RESET' to confirm: ")
        if confirm == "RESET":
            reset_database()
        else:
            print("❌ Operation cancelled.")
    elif choice == "3":
        confirm = input("Add sample data? Type 'YES' to confirm: ")
        if confirm == "YES":
            add_sample_data()
        else:
            print("❌ Operation cancelled.")
    else:
        print("❌ Invalid choice.")
    
    print("\n🎉 Database setup completed!")
    print("\n💡 Next steps:")
    print("   1. Run: python app.py")
    print("   2. Open: http://localhost:5000")
    print("   3. Add items through the web interface")
    print("   4. View them in the 'Database Info' section")