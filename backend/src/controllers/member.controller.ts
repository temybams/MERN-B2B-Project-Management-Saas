import {Request, Response} from 'express';
import { asyncHandler } from '../middlewares/async.Middleware';
import {z} from 'zod';
import { HTTPSTATUS } from '../config/http.config';
import { joinWorkspaceByInviteService } from '../services/member.service';
import { RequestWithUser } from '../@types/request';

export const joinWorkspaceController = asyncHandler(async(req:RequestWithUser, res:Response) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id!;

    const {workspaceId, role} = await joinWorkspaceByInviteService(userId, inviteCode);

    return res.status(HTTPSTATUS.OK).json({
        message: 'Joined workspace successfully',
        workspaceId,
        role
    });
})