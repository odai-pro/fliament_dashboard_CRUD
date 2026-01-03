<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
    protected function afterSave(): void
    {
        /** @var \App\Models\Product $record */
        $record = $this->getRecord();
        $data = $this->data;

        // Handle Main Image Upload
        if (isset($data['image_upload']) && is_array($data['image_upload'])) {
            // Note: This will ADD images, not replace.
            foreach ($data['image_upload'] as $file) {
                try {
                    $filePath = null;
                    
                    if (is_string($file)) {
                        $possiblePaths = [
                            Storage::disk('public')->path($file),
                            storage_path('app/public/' . $file),
                        ];
                        
                        if (strpos($file, 'products/') !== 0) {
                            $possiblePaths[] = Storage::disk('public')->path('products/images/' . $file);
                            $possiblePaths[] = storage_path('app/public/products/images/' . $file);
                        }
                        
                        $possiblePaths[] = Storage::disk('public')->path(basename($file));
                        $possiblePaths[] = storage_path('app/public/' . basename($file));
                        
                        foreach ($possiblePaths as $path) {
                            if (file_exists($path)) {
                                $filePath = $path;
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
                        \Illuminate\Support\Facades\Log::warning('Image file not found. Type: ' . gettype($file));
                        continue;
                    }
                    
                    $media = $record->addMedia($filePath)
                        ->usingName(pathinfo($filePath, PATHINFO_FILENAME))
                        ->toMediaCollection('images');
                    
                    \Illuminate\Support\Facades\Log::info('✅ Image added: ' . $media->id . ' - URL: ' . $media->getUrl());
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error adding image: ' . $e->getMessage());
                }
            }
        }

        // Handle Preview Images
        if (isset($data['preview_images_upload']) && is_array($data['preview_images_upload'])) {
            foreach ($data['preview_images_upload'] as $file) {
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
                        \Illuminate\Support\Facades\Log::warning('Preview image file not found. Type: ' . gettype($file));
                        continue;
                    }
                    
                    $record->addMedia($filePath)
                        ->usingName(pathinfo($filePath, PATHINFO_FILENAME))
                        ->toMediaCollection('preview_images');
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error adding preview image: ' . $e->getMessage());
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
                        \Illuminate\Support\Facades\Log::warning('3D file not found. Type: ' . gettype($file));
                        return;
                    }
                    
                    // Clear existing 3D files (single file collection)
                    $record->clearMediaCollection('3d_files');
                    $record->addMedia($filePath)
                        ->usingName(pathinfo($filePath, PATHINFO_FILENAME))
                        ->toMediaCollection('3d_files');
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error adding 3D file: ' . $e->getMessage());
                }
            }
        }
    }
}
