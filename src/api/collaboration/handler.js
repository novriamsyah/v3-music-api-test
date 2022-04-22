class CollaborationHandler {
    constructor(collaborationService, playlistService, userService, validator) {
      this._collaborationService = collaborationService;
      this._playlistService = playlistService;
      this._userService = userService;
      this._validator = validator;
  
      this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
      this.deleteCollaborationHandler =
        this.deleteCollaborationHandler.bind(this);
    }
  
    async postCollaborationHandler(request, h) {

      try {
        this._validator.validateCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;
    
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
        await this._userService.getUserById(userId);
        const collaborationId = await this._collaborationService.addCollaboration(
          playlistId,
          userId,
        );
    
        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborationId,
            },
        });
    
        response.code(201);
        return response;

      } catch (error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
  
          response.code(error.statusCode);
          return response;
  
        }
   
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
  
        response.code(500);
        console.error(error);
  
        return response;
        }
     
    }
  
    async deleteCollaborationHandler(request) {

        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;
        
            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collaborationService.deleteCollaboration(playlistId, userId);
        
            return {
              status: 'success',
              message: 'Kolaborasi berhasil dihapus',
            };

        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
    
            response.code(error.statusCode);
            return response;
    
          }
     
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
    
          response.code(500);
          console.error(error);
    
          return response;
        }
    }

}
  
module.exports = CollaborationHandler;