import json
import urllib.request
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from api.models import Product, Category
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populate the database with fresh product data from DummyJSON API'

    def handle(self, *args, **options):
        url = "https://dummyjson.com/products?limit=30"
        self.stdout.write(f"Fetching fresh data from {url}...")
        
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        )

        try:
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to fetch data: {e}"))
            return

        for item in data['products']:
            # Handle Category
            category_name = item['category'].capitalize()
            category, created = Category.objects.get_or_create(
                name=category_name,
                defaults={'description': f'Premium products in {category_name}'}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category_name}'))

            # Handle Product
            product_name = item['title']
            
            # Use get_or_create to update instead of duplicate
            product, created = Product.objects.get_or_create(
                name=product_name,
                defaults={'category': category, 'price': Decimal('0'), 'description': ''}
            )
            
            product.description = item['description']
            product.price = Decimal(str(item['price']))
            product.discount = int(item['discountPercentage'])
            product.stock = item['stock']
            product.rating = item['rating']
            product.category = category
            product.featured = (item['id'] % 5 == 0)

            # Download Image
            image_url = item['thumbnail']
            try:
                img_name = f"{slugify(product_name)}.webp"
                self.stdout.write(f"Downloading image for {product_name}...")
                
                img_req = urllib.request.Request(
                    image_url, 
                    headers={'User-Agent': 'Mozilla/5.0'}
                )
                
                with urllib.request.urlopen(img_req) as img_response:
                    product.image.save(img_name, ContentFile(img_response.read()), save=False)
                self.stdout.write(self.style.SUCCESS(f'Uploaded image to Cloudinary for: {product_name}'))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f'Failed to download image for {product_name}: {e}'))
                # Fallback to a placeholder if image fails
                placeholder_url = f"https://dummyjson.com/image/400?text={slugify(product_name)}"
                try:
                    p_req = urllib.request.Request(placeholder_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(p_req) as img_response:
                         product.image.save(f"{slugify(product_name)}-placeholder.png", ContentFile(img_response.read()), save=False)
                except:
                    pass

            product.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully processed product: {product_name}'))

        self.stdout.write(self.style.SUCCESS('Database population complete!'))
