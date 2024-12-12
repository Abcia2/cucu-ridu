
const { Deck, QuestionsArr, AnswerArr } = require('./Deck')
const { User , Guest, Admin } = require('./User')
const Alpha = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890"

class RoomPool
{
    constructor()
    {
        this.rooms = []
    }

    Create(adminName)
    {
        while(true)
        {
            const room = new Room(adminName)
            if(this.Find(room.id) == -1)
            {
                this.rooms.push(room)
                return room
            }
        }
    }

    Find(roomid)
    {
        for(let i = 0; i<this.rooms.length;i++)
        {
            if(roomid == this.rooms[i].id)
            {
                return i
            }
        }
        return -1
    }

    FindRoom(roomid)
    {
        for(let i = 0; i<this.rooms.length;i++)
        {
            if(roomid == this.rooms[i].id)
            {
                return this.rooms[i]
            }
        }
        return null
    }
}

class Room
{
    constructor(adminName) 
    {
        this.id = this.constructor.RandomId(16)
        this.admin = new Admin(adminName)
        this.users = [this.admin];
        this.Questions = new Deck(QuestionsArr)
        this.Answers = new Deck(AnswerArr)
        this.RoundNumber = 0;
        this.LastWon = null;
        this.CurrentRound = {
            received: 0,
            question: null,
            answers: [],
            isRound: false,
            master: 0
        }
    }

    async getId(unicid)
    {
        if(this.users.find(value => value.unicid == unicid) && Admin.Is(unicid))
        {
            return this.id
        }
        return null
    }

    async Add(name)
    {
        const user = new Guest(name)
        this.rooms.push(user)
        return user
    }

    static async RandomId(len)
    {
        let temp = ""
        let prev = ""
        for(let i = 0; i<len+1;i++)
        {
            let letter = Alpha[Math.floor((Math.random() + (Alpha.length-1)) - (Alpha.length-1))]
            while(letter == prev)
            {
                letter = Alpha[Math.floor((Math.random() + (Alpha.length-1)) - (Alpha.length-1))]
            }
            temp += letter
            prev = letter
        }
        return temp
    }

    async StartRound() 
    {
        if (this.RoundNumber === 0) {
            this.CurrentRound.master = 0
        } 
        else 
        {
            this.CurrentRound.master = this.LastWon || 0
        }
    
        const master = this.users[this.CurrentRound.master];
        master.IsAsking = true;
    
        this.CurrentRound.question = this.Questions.Pick(1)
        if (!this.CurrentRound.question) 
        {
            throw new Error("Non ci sono più domande")
        }
    }
    
    async ReceiveAnswer(userId, answer) 
    {
        this.CurrentRound.answers.push({ userId, answer })
        this.CurrentRound.received++;
    }
}

module.exports = { Room, RoomPool, QuestionsArr, AnswerArr };