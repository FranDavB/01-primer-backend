import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public, Roles } from 'src/customDecorators';
import { Role } from 'src/role.enum';
import { PostSocketGateway } from 'src/web-socket/web-socket.gateway';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postSocketGateway: PostSocketGateway
  ) { }

  @Roles(Role.Admin, Role.User)
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log('Creating post');
    try {
      const newPost = await this.postsService.create(createPostDto);
      console.log(`Se ha agregado un nuevo post: ${newPost.nombre}`)
      this.postSocketGateway.emitEvent('post_agregado', newPost)
      return {
        message: 'Post agregado correctamente',
        statusCode: HttpStatus.OK,
        data: newPost,
      };
    } catch (error) {
      console.log(`Error al intentar agregar el post: ${createPostDto.nombre}`)
      throw new HttpException(`Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    } 
  }

  @Public()
  @Get()
  async findAll() {
    try {
      return this.postsService.findAll();
    } catch {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: number) {
    return this.postsService.remove(+id);
  }
}
