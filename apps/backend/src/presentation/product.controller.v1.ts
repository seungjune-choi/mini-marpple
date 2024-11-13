import { Body, Controller, Get, Param, Post, Put, Query, UseMiddleware } from '@libs/decorators';
import { ProductImageService, ProductService } from '@backend/usecase';
import { BodyValidator } from '@libs/middlewares';
import { ResponseEntity } from '@libs/rest';
import { HttpException, NotFoundException } from '@libs/exceptions/http';
import { HttpStatus } from '@libs/enums';
import { CreateProductRequest, UpdateProductRequest } from './dto/request';
import { FindOneProductResponse, FindManyProductResponse } from './dto/response';

@Controller('/products/v1')
export class ProductControllerV1 {
  constructor(
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productService
      .findOne(id)
      .then((product) => {
        if (!product) throw new HttpException(HttpStatus.NOT_FOUND, 'Product not found');
        return product;
      })
      .then((product) => ResponseEntity.ok(FindOneProductResponse.fromEntity(product)));
  }

  @Get()
  async findMany(
    @Query('limit') limit: string,
    @Query('cursor') cursor?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return await this.productService
      .findMany({
        limit: limit ? +limit : undefined,
        cursor: cursor ? +cursor : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      })
      .then((res) => ResponseEntity.ok(FindManyProductResponse.from(res)));
  }

  @UseMiddleware(BodyValidator(CreateProductRequest))
  @Post()
  async create(@Body() request: CreateProductRequest) {
    const representativeImageId = request.images.find((image) => image.isRepresentative)?.id || request.images[0].id;
    const images = await this.productImageService.findMany(request.images.map((image) => image.id));
    images.find((image) => image.id === representativeImageId)?.setRepresentative(true);

    return await this.productService.create(request.toEntity(images)).then(ResponseEntity.created);
  }

  @UseMiddleware(BodyValidator(UpdateProductRequest))
  @Put(':id')
  async update(@Param('id') id: number, @Body() request: UpdateProductRequest) {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }

    const representativeImageId = request.images.find((image) => image.isRepresentative)?.id || request.images[0].id;
    const images = await this.productImageService.findMany(request.images.map((image) => image.id));
    images.find((image) => image.id === representativeImageId)?.setRepresentative(true);

    return await this.productService.update(product, request.toCoreDto(images)).then(ResponseEntity.ok);
  }
}
