from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetDialogsRequest
from telethon.tl.types import InputPeerEmpty
import os
import sys
import configparser
import csv
import time
import json
from os import listdir
from os.path import isfile, join

# photosFolder = os.getcwd()+'/photos'
# photoNames = []
# for f in listdir(photosFolder):
#     if isfile(join(photosFolder, f)):
#         photoNames.append(f.split('.')[0])

re = "\033[1;31m"
gr = "\033[1;32m"
cy = "\033[1;36m"


def banner():
    print(f"""
{re}╔╦╗{cy}┌─┐┬  ┌─┐{re}╔═╗  ╔═╗{cy}┌─┐┬─┐┌─┐┌─┐┌─┐┬─┐
{re} ║ {cy}├┤ │  ├┤ {re}║ ╦  ╚═╗{cy}│  ├┬┘├─┤├─┘├┤ ├┬┘
{re} ╩ {cy}└─┘┴─┘└─┘{re}╚═╝  ╚═╝{cy}└─┘┴└─┴ ┴┴  └─┘┴└─
            version : 3.1
        """)


cpass = configparser.RawConfigParser()
cpass.read('config.data')

try:
    api_id = cpass['cred']['id']
    api_hash = cpass['cred']['hash']
    phone = cpass['cred']['phone']
    client = TelegramClient(phone, api_id, api_hash)
except KeyError:
    os.system('clear')
    banner()
    print(re+"[!] run python3 setup.py first !!\n")
    sys.exit(1)

client.connect()
if not client.is_user_authorized():
    client.send_code_request(phone)
    os.system('clear')
    banner()
    client.sign_in(phone, input(gr+'[+] Enter the code: '+re))

os.system('clear')
banner()
chats = []
last_date = None
chunk_size = 200
groups = []

result = client(GetDialogsRequest(
    offset_date=last_date,
    offset_id=0,
    offset_peer=InputPeerEmpty(),
    limit=chunk_size,
    hash=0
))
chats.extend(result.chats)

for chat in chats:
    try:
        if chat.megagroup == True:
            groups.append(chat)
    except:
        continue

print(gr+'[+] Choose a group to scrape members :'+re)
i = 0
for g in groups:
    print(gr+'['+cy+str(i)+gr+']'+cy+' - ' + g.title)
    i += 1

print('')
g_index = input(gr+"[+] Enter a Number : "+re)
target_group = groups[int(g_index)]

print(gr+'[+] Fetching Members...')
time.sleep(1)
all_participants = []
while_condition = True

all_participants = client.get_participants(target_group, aggressive=False)

print(gr+'[+] Saving In file...')
time.sleep(1)
all_members = []
count = 0
photoCount = 0
with open("members.json", 'w') as file:
    for user in all_participants:
        print(user)
        exit()
        if user.username:
            username = user.username
        else:
            username = ""
        if user.first_name:
            first_name = user.first_name
        else:
            first_name = ""
        if user.last_name:
            last_name = user.last_name
        else:
            last_name = ""
        name = (first_name + ' ' + last_name).strip()
        member = {"userId": user.id, "userName": username,
                  "fullName": name, "photoExists": False}

        print(member)
        # photoName = 'photos/'+str(user.id)
        # if str(user.id) not in photoNames:
        #     photoPath = client.download_profile_photo(
        #         user.id, photoName)
        #     if photoPath:
        #         member["photoExists"] = True
        #         member["imgPath"] = photoPath
        #         photoCount += 1
        #     else:
        #         member["photoExists"] = False
        # else:
        #     member["photoExists"] = True
        #     member["imgPath"] = photoName
        #     photoCount += 1

        all_members.append(member)
        time.sleep(1)
        count += 1
        if count % 5 == 0:
            print("Sleeping..")
            time.sleep(1)
    json.dump(all_members, file)

print("photocount =" + str(photoCount))
print("count = " + str(count))
print(gr+str(count)+'[+] Members scraped successfully.')
print(all_members)
