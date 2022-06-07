const PostQueries = require('../../queries/MeetingQueries')
const MeetingQueries = require('../../queries/MeetingQueries')
const MeetingResolvers = {
    Query: {
        getAllMeetings: () =>{
            return PostQueries.getAllMeetings();
        },
    },
    Mutation: {
        createNewMeeting: async (_, {name,date, type, creator,status}) => {
            await MeetingQueries.createNewMeeting(name,date, type,status, creator)

            const meeting = await MeetingQueries.getLastMeeting();

            MeetingQueries.addMeetingUser(meeting.id, creator);

            meeting.date = new Date(meeting.date).toDateString()
            return meeting
        },
        inviteUserToMeeting: (_, {meeting_id, user_id}) => {
            try{
                MeetingQueries.addMeetingUser(meeting_id, user_id)
            } catch (err) {
                return false
            }
            return true
        },
        createMeetingMessage: (_, {meeting_id, author,content, referenceMessageId}) =>{
            try{
                MeetingQueries.addMeetingMessage(meeting_id, author, content, referenceMessageId);
            } catch (err){

            }
        },
        deleteMeeting: async (_, {meeting_id, user_id}) => {
            const users = await MeetingQueries.getAllMeetingMembers(meeting_id);


            await MeetingQueries.removeMeetingUser(meeting_id, user_id);
            if (users.length > 1) {return true}
            await MeetingQueries.deleteMeeting(meeting_id)
            return true
        },
        changeMeeting: async (_, {meeting_id, name, date}, ctx) => {
            const checkIfUserInMeeting = (user_id, members)=>{
                for (i of members) {
                    if (i.id == user_id){
                        return true;
                    }
                    return false
                } 
            } 
            try{
                const user = verify(ctx.req.headers['verify-token'], process.env.SECRET_WORD).user;
                
                if (!isRolesInUser(await getUserRoles(user.id), ["ADMIN"]) 
                && !checkIfUserInMeeting(user.id, await MeetingQueries.getAllMeetingMembers(meeting_id)))
                    throw Error("You do not have rights (basically woman)")

            } catch (err){
                throw Error("You do not have rights (basically woman)")
            }
            
            MeetingQueries.changeMeeting(meeting_id, name, date);
            return MeetingQueries.getMeetingById(meeting_id)
        }
    },
    Meeting:{
        type: async (meeting) =>{
            return (await MeetingQueries.getMeetingType(meeting.id)).name
        },
        members: async (meeting) => {
            return MeetingQueries.getAllMeetingMembers(meeting.id)
        },
        creator: async (meeting) => {
            return MeetingQueries.getMeetingCreator(meeting.id);
        }
    }
}
module.exports = {MeetingResolvers}