<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    protected function afterCreate(): void
    {
        /** @var \App\Models\Product $record */
        $record = $this->getRecord();
        $data = $this->data;

        // Debug: Log all data keys
        Log::info('CreateProduct afterCreate - Data keys: ' . implode(', ', array_keys($data ?? [])));
        
        // Handle Main Image Upload
        if (isset($data['image_upload']) && is_array($data['image_upload'])) {
            Log::info('Processing ' . count($data['image_upload']) . ' image(s)');
            
            foreach ($data['image_upload'] as $index => $file) {
                try {
                    Log::info("Processing image #{$index}: Type=" . gettype($file) . ", Value=" . (is_string($file) ? $file : (is_object($file) ? get_class($file) : 'unknown')));
                    
                    $filePath = null;
                    
                    if (is_string($file)) {
                        // Filament FileUpload with disk('public')->directory('products/images')
                        // stores files and returns path relative to disk root
                        // $file could be: "products/images/filename.jpg" or just "filename.jpg"
                        
                        // First, try as-is (full relative path)
                        $possiblePaths = [
                            Storage::disk('public')->path($file), // Full path
                            storage_path('app/public/' . $file), // Direct storage
                        ];
                        
                        // If file doesn't start with 'products/', try adding the directory
                        if (strpos($file, 'products/') !== 0) {
                            $possiblePaths[] = Storage::disk('public')->path('products/images/' . $file);
                            $possiblePaths[] = storage_path('app/public/products/images/' . $file);
                        }
                        
                        // Also try in root of public disk
                        $possiblePaths[] = Storage::disk('public')->path(basename($file));
                        $possiblePaths[] = storage_path('app/public/' . basename($file));
                        
                        foreach ($possiblePaths as $path) {
                            if (file_exists($path)) {
                                $filePath = $path;
                                Log::info("✅ Found file at: {$filePath}");
                                break;
                            }
                        }
                        
                        if (!$filePath) {
                            Log::warning("❌ File not found. Tried paths: " . implode(', ', array_filter($possiblePaths)));
                            // List what's actually in the directory
                            $dirContents = Storage::disk('public')->files('products/images');
                            Log::info("Files in products/images: " . implode(', ', $dirContents));
                        }
                    } elseif (is_object($file)) {
                        // Check if it's an UploadedFile
                        if (method_exists($file, 'getRealPath')) {
                            $filePath = $file->getRealPath();
                            Log::info("UploadedFile getRealPath: {$filePath}");
                        } elseif (method_exists($file, 'path')) {
                            $filePath = $file->path();
                            Log::info("File object path(): {$filePath}");
                        } elseif (property_exists($file, 'path')) {
                            $filePath = $file->path;
                            Log::info("File object property path: {$filePath}");
                        }
                    }
                    
                    if (!$filePath || !file_exists($filePath)) {
                        Log::error("Image file not found after all attempts. Type: " . gettype($file));
                        continue;
                    }

                    $media = $record->addMedia($filePath)
                        ->usingName(pathinfo($filePath, PATHINFO_FILENAME))
                        ->toMediaCollection('images');
                    
                    Log::info('✅ Image added successfully! Media ID: ' . $media->id . ', URL: ' . $media->getUrl());
                } catch (\Exception $e) {
                    Log::error('❌ Error adding image: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
                }
            }
        } else {
            Log::warning('No image_upload found in data. Available keys: ' . implode(', ', array_keys($data ?? [])));
        }

        // Handle Preview Images
        if (isset($data['preview_images_upload']) && is_array($data['preview_images_upload'])) {
            Log::info('Processing ' . count($data['preview_images_upload']) . ' preview image(s)');
            
            foreach ($data['preview_images_upload'] as $index => $file) {
                try {
                    $filePath = null;
                    
                    if (is_string($file)) {
                        $possiblePaths = [
                            Storage::disk('public')->path($file),
                            storage_path('app/public/' . $file),
                        ];
                        
                        if (strpos($file, 'products/') !== 0) {
                            $possiblePaths[] = Storage::disk('public')->path('products/preview_images/' . $file);
                            $possiblePaths[] = storage_path('app/public/products/preview_images/' . $file);
                        }
                        
                        $possiblePaths[] = Storage::disk('public')->path(basename($file));
                        $possiblePaths[] = storage_path('app/public/' . basename($file));
                        
                        foreach ($possiblePaths as $path) {
                            if (file_exists($path)) {
                                $filePath = $path;
                                Log::info("✅ Found preview image at: {$filePath}");
                                break;
                            }
                        }
                    } elseif (is_object($file)) {
                        if (method_exists($file, 'getRealPath')) {
                            $filePath = $file->getRealPath();
                        } elseif (method_exists($file, 'path')) {
                            $filePath = $file->path();
                        } elseif (property_exists($file, 'path')) {
                            $filePath = $file->path;
                        }
                    }
                    
                    if (!$filePath || !file_exists($filePath)) {
                        Log::warning('Preview image file not found. Type: ' . gettype($file));
                        continue;
                    }

                    $record->addMedia($filePath)
                        ->usingName(pathinfo($filePath, PATHINFO_FILENAME))
                        ->toMediaCollection('preview_images');
                    
                    Log::info('✅ Preview image added successfully');
                } catch (\Exception $e) {
                    Log::error('Error adding preview image: ' . $e->getMessage());
                }
            }
        }

        // Handle 3D File
        if (isset($data['3d_file_upload'])) {
            $file = $data['3d_file_upload'];
            if (is_array($file)) {
                $file = reset($file);
            }
            
            if ($file) {
                try {
                    Log::info('Processing 3D file: Type=' . gettype($file));
                    $filePath = null;
                    
                    if (is_string($file)) {
                        $possiblePaths = [
                            Storage::disk('public')->path($file),
                            storage_path('app/public/' . $file),
                        ];
                        
                        if (strpos($file, 'products/') !== 0) {
                            $possiblePaths[] = Storage::disk('public')->path('products/3d_files/' . $file);
                            $possiblePaths[] = storage_path('app/public/products/3d_files/' . $file);
                        }
                        
                        $possiblePaths[] = Storage::disk('public')->path(basename($file));
                        $possiblePaths[] = storage_path('app/public/' . basename($file));
                        
                        foreach ($possiblePaths as $path) {
                            if (file_exists($path)) {
                                $filePath = $path;
                                Log::info("✅ Found 3D file at: {$filePath}");
                                break;
                            }
                        }
                    } elseif (is_object($file)) {
                        if (method_exists($file, 'getRealPath')) {
                            $filePath = $file->getRealPath();
                        } elseif (method_exists($file, 'path')) {
                            $filePath = $file->path();
                        } elseif (property_exists($file, 'path')) {
                            $filePath = $file->path;
                        }
                    }
                    
                    if (!$filePath || !file_exists($filePath)) {
                        Log::warning('3D file not found. Type: ' . gettype($file));
                        return;
                    }

                    // Clear existing 3D files (single file collection)
                    $record->clearMediaCollection('3d_files');
                    $record->addMedia($filePath)
                        ->usingName(pathinfo($filePath, PATHINFO_FILENAME))
                        ->toMediaCollection('3d_files');
                    
                    Log::info('✅ 3D file added successfully');
                } catch (\Exception $e) {
                    Log::error('Error adding 3D file: ' . $e->getMessage());
                }
            }
        }
    }
}
