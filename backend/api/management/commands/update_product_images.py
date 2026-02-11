import os
import urllib.request
from django.core.management.base import BaseCommand
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from api.models import Product

class Command(BaseCommand):
    help = 'Update products with high-quality generated and sourced images'

    def handle(self, *args, **options):
        # Mappings of product names to image sources (local path or remote URL)
        image_mappings = {
            "iPhone 9": "/home/atom/.gemini/antigravity/brain/ed9dbe29-13df-4759-b44d-52ee12eff10b/iphone_9_studio_1770809702034.png",
            "iPhone X": "/home/atom/.gemini/antigravity/brain/ed9dbe29-13df-4759-b44d-52ee12eff10b/iphone_x_studio_1770809716425.png",
            "MacBook Pro": "/home/atom/.gemini/antigravity/brain/ed9dbe29-13df-4759-b44d-52ee12eff10b/macbook_pro_studio_1770809732249.png",
            "perfume Oil": "/home/atom/.gemini/antigravity/brain/ed9dbe29-13df-4759-b44d-52ee12eff10b/perfume_oil_gold_studio_1770809756728.png",
            "Hyaluronic Acid Serum": "/home/atom/.gemini/antigravity/brain/ed9dbe29-13df-4759-b44d-52ee12eff10b/hyaluronic_acid_dropper_studio_1770809772450.png",
        }

        # Category-based fallbacks (LoremFlickr for reliable 'real-world' shots)
        category_fallbacks = {
            "smartphones": "https://loremflickr.com/640/480/iphone,smartphone",
            "laptops": "https://loremflickr.com/640/480/laptop,computer",
            "fragrances": "https://loremflickr.com/640/480/perfume,fragrance",
            "skincare": "https://loremflickr.com/640/480/skincare,cosmetics",
            "groceries": "https://loremflickr.com/640/480/groceries,food",
            "home-decoration": "https://loremflickr.com/640/480/homedecor,furniture",
        }

        products = Product.objects.all()
        for product in products:
            source = image_mappings.get(product.name)
            if not source:
                category_slug = product.category.slug if product.category else "home-decoration"
                source = category_fallbacks.get(category_slug, category_fallbacks["home-decoration"])

            self.stdout.write(f"Updating {product.name} with {source}...")

            try:
                if source.startswith("http"):
                    # Handle Remote URL
                    img_temp = NamedTemporaryFile(delete=True)
                    opener = urllib.request.build_opener()
                    opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
                    with opener.open(source) as response:
                        img_temp.write(response.read())
                    img_temp.flush()
                    product.image.save(f"{product.slug}.jpg", File(img_temp), save=True)
                else:
                    # Handle Local Path
                    if os.path.exists(source):
                        with open(source, 'rb') as f:
                            product.image.save(f"{product.slug}.png", File(f), save=True)
                    else:
                        self.stdout.write(self.style.WARNING(f"Local file not found: {source}"))
                
                self.stdout.write(self.style.SUCCESS(f"Successfully updated {product.name}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to update {product.name}: {e}"))

        self.stdout.write(self.style.SUCCESS("All product images updated!"))
