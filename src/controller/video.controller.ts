import { Controller, Get, Post, Body, UseInterceptors, UploadedFiles, Res, Req, HttpStatus, Query, Put, Param, Delete } from '@nestjs/common';
import { Video } from '../model/video.schema';
import { VideoService } from '../service/video.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/video')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'video', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]))
    async createBook(@Res() response, @Req() request, @Body() video: Video, @UploadedFiles() files: { video?: Express.Multer.File[], cover?: Express.Multer.File[] }) {
        const requestBody = { createdBy: request.user, title: video.title, video: files.video[0].filename, coverImage: files.cover[0].filename }
        const newVideo = await this.videoService.createVideo(requestBody);
        return response.status(HttpStatus.CREATED).json({
            newVideo
        })
    }

    @Get()
    async read(@Query() id): Promise<Object> {
        return await this.videoService.getVideo(id)
    }

    @Get('/:id')
    async stream(@Param('id') id, @Res() response, @Req() request) {
        return this.videoService.streamVideo(id, response, request);
    }

    @Put('/:id')
    async update(@Res() response, @Param('id') id, @Body() video: Video) {
        const updateVideo = await this.videoService.update(id, video);
        return response.status(HttpStatus.OK).json(updateVideo);
    }

    @Delete('/:id')
    async delete(@Res() response, @Param('id') id) {
        await this.videoService.delete(id);
        return response.static(HttpStatus.OK).json({
            user: null
        })
    }
}