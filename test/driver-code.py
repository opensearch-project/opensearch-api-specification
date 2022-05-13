import argparse
import os

class Dredd:
    def __init__(self, endpoint, user, path, test_name):
        if endpoint is not None:
            self.endpoint = endpoint
        else:     
            self.endpoint = "https://127.0.0.1:9200"

        if user is not None:
            self.user = user
        else:
            self.user = "admin:admin"

        if path is not None:
            self.path = path
        else:
            self.path = ""    

        if test_name is not None:
            self.test_name  = test_name 
        else:
            self.test_name = ""  

    def write_file(self): 
        file_obj = open("url.txt", mode='w', encoding='utf-8') 
        text = self.endpoint + " " + self.user 
        file_obj.write(text)
        file_obj.seek(0,0)
        file_obj.close()

    def dredd_work(self):
        # Walking in test directory tree and runing dredd framework.
        test_failed = 0
        test_passed = 0
        for dirpath, dirnames, files in os.walk("./models"+self.path):
            curr_path = dirpath.split('/')
            curr_dir = curr_path[len(curr_path)-1]         
            if files:
                command = "dredd " + dirpath +"/"+ files[1]+ " " + self.endpoint+ " --user=" + self.user + " --hookfiles=" + dirpath + "/" + files[0]
                if self.test_name != "":
                    if self.test_name == curr_dir:
                        result = os.system(command)
                        if(result != 0):
                            test_failed = test_failed+1  
                        else:
                            test_passed = test_passed+1                                  
                else:
                    result = os.system(command)  
                    if(result != 0):
                        test_failed = test_failed+1
                    else:
                        test_passed = test_passed+1  
        print("Total test cases: ", test_passed+test_failed)
        print("Test failed: ", test_failed)
        return test_failed      


# Parsing command line arguments:
parser = argparse.ArgumentParser()

parser.add_argument('--endpoint', type=str, required=False)
parser.add_argument('--user', type=str, required=False)
parser.add_argument('--path', type=str, required=False)
parser.add_argument('--testname', type=str, required=False)
args = parser.parse_args()

# Check whether default arguments provided by user:
obj = Dredd(args.endpoint,args.user,args.path,args.testname)

# Creating a intermediate file for storing URL.
obj.write_file()

# Running dredd
exit(obj.dredd_work())
