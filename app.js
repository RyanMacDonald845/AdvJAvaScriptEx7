import {MongoClient, objectId} from 'mongodb';

// connection string

const uri = "mongodb://admin:LocalMongo_Dev2026!@localhost:27017/";

// The object to work with the database
const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
});

const connect = async () => {
    let connection;

    try {
        connection = await client.connect();
        console.log('Connection established');
    } catch (error) {
        console.log(error.message)
    }finally{
        if(!!connection){
             connection.close();
            console.log('Connection closed');
        }else{
            console.log('Connection was never created')
        }
    }
}

const insertStudent = async student => {
    // Get our Database or create if it doesn't exist
    const db = client.db('nbcc');
   
    // Gets our collection or creates if not exist
    const studentsCollection = db.collection('students');

    // Insert a student document
    const result = await studentsCollection.insertOne(student); 

    if(!!result){
        console.log(`Student created with Id: ${result.insertedId}`);
    }
}

const insertStudents = async students => {
    const db = client.db('nbcc');
    const studentsCollection = db.collection('students');

    const results = await studentsCollection.insertMany(students);

    console.log(`Created ${results.insertedCount} students`)
}

const getStudents = async () => {
    const db = client.db('nbcc');
    const col = db.collection('students');

    //find to query documents
    // find take an object that is used as a filter "where" clause
    // the .toArray() call will convert docs to 
    const studentList = await col.find({}).toArray();

    for(const student of studentList){
        console.log(student.firstName, student.lastName, student._id)
    }
}

const getStudent = async id => {
    const db = client.db('nbcc');
    const col = db.collection('students');
    const query = {
        _id: id
    }

    const result = await col.findOne(query);

    return result;
}

const updateStudent = async student => {
    const db = client.db('nbcc');
    const col = db.collection('students');
    const query = {
        _id: student._id
    }

    const studentUpdate = {
        $set: student
    }

    await col.updateOne(query, studentUpdate);
}

const deleteStudent = async id => {
    const db = client.db('nbcc');
    const col = db.collection('students');
    const query = {
        _id: id
    }

    const result = await col.deleteOne(query);

    console.log(`Deleted count: ${result.deleteCount}`);    
}

const main = async() => {
    try{
        // console.log('Run our connection tester')
        // await connect();
        // console.log('Connection test completed')
        // await insertStudents({
        //     firstName: 'Bruce',
        //     lastName: 'Wayne'
        // },
        // {
        //     firstName: 'Jane',
        //     lastName: 'Rogers',
        //     middleInitial: 'A'
        // },
        // {
        //     firstName: "Kyle",
        //     lastName: "Junior"
        // });

        await getStudents();

        //"implement from compass once set up"
        const id = new objectId("ABC1234567890DEF")
        const student = await getStudent(id);

        if(!!student){
            console.log(`Found student ${student.firstName} ${student.lastName}`);  

            student.firstName = 'Kathlean';

            await updateStudent(student);
            
            let updatedStudent = await getStudent(student._id);
            console.log(updateStudent);
        } else {
            console.log(`Student not found for id: ${id.toString()}`);
        }

        if (!!client){
            client.close();
        }
    }
    catch(err){
        console.log(err.message);
    }
}

await main();


 