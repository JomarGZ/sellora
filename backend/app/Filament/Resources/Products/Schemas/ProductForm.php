<?php

declare(strict_types=1);

namespace App\Filament\Resources\Products\Schemas;

use Closure;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

final class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Select::make('brand_id')
                            ->label('Brand')
                            ->relationship(name: 'brand', titleAttribute: 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        Select::make('product_category_id')
                            ->label('Category')
                            ->relationship(name: 'category', titleAttribute: 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        RichEditor::make('description')
                            ->columnSpanFull(),

                    ])
                    ->columns(2),

                Section::make('Product Images')
                    ->schema([
                        Repeater::make('images')
                            ->relationship(name: 'images')
                            ->schema([
                                FileUpload::make('image_path')
                                    ->image()
                                    ->disk('public')
                                    ->required()
                                    ->directory('products')
                                    ->visibility('public'),
                                Toggle::make('is_primary')
                                    ->label('Primary Image')
                                    ->live()
                                    ->afterStateUpdated(function ($state, callable $set, callable $get): void {
                                        if ($state) {
                                            $images = $get('../../images');
                                            if (! is_array($images)) {
                                                return;
                                            }

                                            foreach (array_keys($images) as $index) {
                                                $set(sprintf('../../images.%s.is_primary', $index), false);
                                            }

                                            $set('is_primary', true);
                                        }
                                    }),

                            ])
                            ->columns(2)
                            ->addActionLabel('Add Image')
                            ->maxItems(5)
                            ->minItems(1)
                            ->afterStateUpdated(function (array $state, callable $set): void {
                                $hasPrimary = collect($state)->contains('is_primary', true);

                                if (! $hasPrimary && $state !== []) {
                                    $set('images.0.is_primary', true);
                                }
                            })
                            ->rules(fn (): Closure => function ($attribute, array $value, callable $fail): void {
                                $primaryCount = collect($value)->where('is_primary', true)->count();

                                if ($primaryCount === 0) {
                                    $fail('You must select one primary image.');
                                }

                                if ($primaryCount > 1) {
                                    $fail('Only one image can be primary.');
                                }
                            }),
                    ]),
            ]);
    }
}
