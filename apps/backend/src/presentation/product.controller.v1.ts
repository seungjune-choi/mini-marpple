import { Body, Controller, Get, Param, Post, Put, Query, UseMiddleware } from '@libs/decorators';
import { ProductImageService, ProductService } from '@backend/usecase';
import { AdminMiddleware, AuthGuard, BodyValidator } from '@libs/middlewares';
import { ResponseEntity } from '@libs/rest';
import { HttpException, InternalServerErrorException, NotFoundException } from '@libs/exceptions/http';
import { HttpStatus } from '@libs/enums';
import { CreateProductRequest, UpdateProductRequest } from './dto/request';
import { FindOneProductResponse, FindManyProductResponse } from './dto/response';

@Controller('/products/v1')
export class ProductControllerV1 {
  constructor(
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
  ) {}

  @UseMiddleware([AuthGuard, AdminMiddleware])
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
    @Query('limit') _limit: string,
    @Query('cursor') cursor?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const limit = _limit ? +_limit : 10;
    return await this.productService
      .findMany({
        limit,
        cursor: cursor ? +cursor : undefined,
        categoryId: categoryId ? +categoryId : undefined,
      })
      .then((res) => ResponseEntity.ok(FindManyProductResponse.from(res, limit)));
  }

  @UseMiddleware([AdminMiddleware, BodyValidator(CreateProductRequest)])
  @Post()
  async create(@Body() request: CreateProductRequest) {
    try {
      // 대표 이미지가 없을 경우 첫 번째 이미지를 대표 이미지로 설정
      const representativeImageId = request.images.find((image) => image.isRepresentative)?.id ?? request.images[0].id;
      const images = await this.productImageService.findMany(request.images.map((image) => image.id));
      images.find((image) => image.id === representativeImageId)?.setRepresentative(true);

      return await this.productService.create(request.toEntity(images)).then(ResponseEntity.created);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('상품 생성 중 오류가 발생했습니다.');
    }
  }

  @UseMiddleware([AdminMiddleware, BodyValidator(UpdateProductRequest)])
  @Put(':id')
  async update(@Param('id') id: number, @Body() request: UpdateProductRequest) {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }

    const representativeImageId = request.images.find((image) => image.isRepresentative)?.id ?? request.images[0].id;
    const images = await this.productImageService.findMany(request.images.map((image) => image.id));
    images.forEach((image) => image.setRepresentative(image.id === representativeImageId));
    console.log('images', images);
    return await this.productService.update(product, request.toCoreDto(images)).then(ResponseEntity.ok);
  }
}
